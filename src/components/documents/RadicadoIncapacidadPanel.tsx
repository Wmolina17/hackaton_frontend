import { useCallback, useEffect, useRef, useState } from "react";
import { historialesApi } from "@/api/historiales";
import { radicadoApi } from "@/api/radicado";
import { Button } from "@/components/ui/Button";
import type { HistorialClinico } from "@/types/historial";
import type { RadicacionJob } from "@/types/radicado";
import "./RadicadoIncapacidadPanel.css";

const POLL_MS = 2500;

const STEPS = [
  { id: 1, label: "OCR — extracción del PDF" },
  { id: 2, label: "RETHUS — validación médico" },
  { id: 3, label: "ADRES — afiliación EPS" },
  { id: 4, label: "Reporte final" },
] as const;

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function stepClass(job: RadicacionJob, stepId: number): string {
  if (job.estado === "error" && job.paso_actual === stepId) return "mn-steps__error";
  if (job.estado === "completo" || job.paso_actual > stepId) return "mn-steps__done";
  if (job.paso_actual === stepId) return "mn-steps__active";
  return "";
}

interface RadicadoIncapacidadPanelProps {
  historialId: string | number;
  historial: HistorialClinico;
  disabled?: boolean;
  onToast?: (message: string, type: "info" | "success" | "error") => void;
}

export function RadicadoIncapacidadPanel({
  historialId,
  historial,
  disabled,
  onToast,
}: RadicadoIncapacidadPanelProps) {
  const [generating, setGenerating] = useState(false);
  const [starting, setStarting] = useState(false);
  const [documentReady, setDocumentReady] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [job, setJob] = useState<RadicacionJob | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pdfUrlRef = useRef<string | null>(null);

  const clearPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const setPreviewBlob = useCallback((blob: Blob) => {
    if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    const url = URL.createObjectURL(blob);
    pdfUrlRef.current = url;
    setPdfPreviewUrl(url);
    setDocumentReady(true);
  }, []);

  const pollJob = useCallback(
    (jobId: string) => {
      clearPoll();
      pollRef.current = setInterval(() => {
        void (async () => {
          const { data, error } = await radicadoApi.getJob(jobId);
          if (error || !data) return;
          setJob(data);
          if (data.estado === "completo") {
            clearPoll();
            onToast?.("Radicación completada", "success");
          }
          if (data.estado === "error") {
            clearPoll();
            onToast?.(data.error ?? "Error en la radicación", "error");
          }
        })();
      }, POLL_MS);
    },
    [clearPoll, onToast]
  );

  useEffect(() => {
    let active = true;

    void (async () => {
      const pdf = await radicadoApi.downloadDocumentoPdf(historialId);
      if (!active || pdf.error || !pdf.data) return;
      setPreviewBlob(pdf.data);
    })();

    void (async () => {
      const { data } = await radicadoApi.getJobByHistorial(historialId);
      if (!active || !data) return;
      setJob(data);
      if (data.estado !== "completo" && data.estado !== "error") {
        pollJob(data.job_id);
      }
    })();

    return () => {
      active = false;
      clearPoll();
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
        pdfUrlRef.current = null;
      }
    };
  }, [historialId, clearPoll, pollJob, setPreviewBlob]);

  async function persistHistorial(): Promise<boolean> {
    const { error } = await historialesApi.update(historialId, historial);
    if (error) {
      onToast?.(error, "error");
      return false;
    }
    return true;
  }

  async function handleGenerarDocumento() {
    setGenerating(true);
    const saved = await persistHistorial();
    if (!saved) {
      setGenerating(false);
      return;
    }

    const dias = historial.incapacidad_dias;
    const { data, error } = await radicadoApi.generarDocumento(historialId, {
      incapacidad_dias: dias,
    });
    if (error || !data) {
      setGenerating(false);
      onToast?.(error ?? "No se pudo generar el documento", "error");
      return;
    }

    const pdf = await radicadoApi.downloadDocumentoPdf(historialId);
    setGenerating(false);
    if (pdf.error || !pdf.data) {
      onToast?.(pdf.error ?? "No se pudo descargar el PDF", "error");
      return;
    }

    setPreviewBlob(pdf.data);
    onToast?.("Documento de incapacidad generado", "success");
  }

  async function handleDescargarPdf() {
    const pdf = await radicadoApi.downloadDocumentoPdf(historialId);
    if (pdf.error || !pdf.data) {
      onToast?.(pdf.error ?? "No se pudo descargar el PDF", "error");
      return;
    }
    downloadBlob(pdf.data, `incapacidad_${historialId}.pdf`);
  }

  async function handleIniciarRadicacion() {
    setStarting(true);
    const saved = await persistHistorial();
    if (!saved) {
      setStarting(false);
      return;
    }

    const { data, error } = await radicadoApi.iniciarRadicacion(Number(historialId));
    setStarting(false);
    if (error || !data) {
      onToast?.(error ?? "No se pudo iniciar la radicación", "error");
      return;
    }

    setJob(data);
    pollJob(data.job_id);
    onToast?.("Radicación iniciada — validando documento…", "info");
  }

  const polling =
    job != null && job.estado !== "completo" && job.estado !== "error" && job.estado !== "pendiente";
  const reporte = job?.pasos.reporte;

  return (
    <section className="radicado-panel" aria-labelledby="radicado-heading">
      <div className="radicado-panel__head">
        <h3 id="radicado-heading">Radicación de incapacidad</h3>
        <p>
          Genera el PDF oficial desde el historial y ejecuta la validación OCR → RETHUS →
          ADRES → reporte final.
        </p>
      </div>

      <div className="radicado-panel__actions">
        <Button
          type="button"
          variant="primary"
          disabled={disabled || generating}
          onClick={() => void handleGenerarDocumento()}
        >
          {generating ? "Generando…" : "Generar documento (PDF)"}
        </Button>
        {documentReady && (
          <Button type="button" variant="secondary" onClick={() => void handleDescargarPdf()}>
            Descargar PDF
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          disabled={disabled || starting || !documentReady || polling}
          onClick={() => void handleIniciarRadicacion()}
        >
          {starting ? "Iniciando…" : polling ? "Radicando…" : "Iniciar radicación"}
        </Button>
      </div>

      {job && (
        <>
          <ol className="mn-steps" aria-label="Pasos de radicación">
            {STEPS.map((step) => (
              <li key={step.id} className={stepClass(job, step.id)}>
                <span>{step.id}</span>
                {step.label}
              </li>
            ))}
          </ol>

          {job.estado === "error" && (
            <p className="radicado-panel__status radicado-panel__status--error" role="alert">
              {job.error ?? "Ocurrió un error durante la radicación."}
            </p>
          )}

          {job.estado === "completo" && (
            <p className="radicado-panel__status radicado-panel__status--success">
              Radicación completada
              {job.score != null && (
                <span className="radicado-panel__score">Score {job.score}%</span>
              )}
            </p>
          )}

          {polling && (
            <p className="radicado-panel__status" role="status">
              Procesando paso {job.paso_actual} de 4…
            </p>
          )}

          {reporte && job.estado === "completo" && (
            <div className="radicado-panel__details">
              <div className="radicado-panel__detail">
                <h4>Estado</h4>
                <p>{String(reporte.status ?? "—")}</p>
              </div>
              {job.recomendacion && (
                <div className="radicado-panel__detail">
                  <h4>Recomendación</h4>
                  <p>{job.recomendacion}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {pdfPreviewUrl && (
        <div className="radicado-panel__preview">
          <iframe title="Vista previa incapacidad" src={pdfPreviewUrl} />
        </div>
      )}
    </section>
  );
}
