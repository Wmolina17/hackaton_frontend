import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { historialesApi } from "@/api/historiales";
import { medicamentosApi } from "@/api/medicamentos";
import { HistorialEditor } from "@/components/historial/HistorialEditor";
import { MedicamentosSection } from "@/components/historial/MedicamentosSection";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { createEmptyHistorial, type HistorialClinico } from "@/types/historial";
import {
  extractNombresMedicamentos,
  mergeMedicamentosWithCobertura,
} from "@/utils/medicamentos";
import { getLastEps, saveAfterBooking } from "@/utils/session";
import "./HistorialPage.css";

function resolveEps(
  searchParams: URLSearchParams,
  historial: HistorialClinico
): string {
  return (
    searchParams.get("eps")?.trim() ||
    historial.paciente_eps ||
    getLastEps() ||
    "Sura"
  );
}

export function HistorialEditorPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const historialId = id ?? "1";

  const [historial, setHistorial] = useState<HistorialClinico>(createEmptyHistorial());
  const [eps, setEps] = useState("Sura");
  const [loading, setLoading] = useState(true);
  const [loadingCobertura, setLoadingCobertura] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "info" | "success" | "error";
  }>({ message: "", type: "info" });

  async function refreshCobertura(
    meds: HistorialClinico["medicamentos"],
    epsValue: string
  ) {
    const nombres = extractNombresMedicamentos(meds);
    if (!nombres.length) return meds;

    setLoadingCobertura(true);
    const { data, error } = await medicamentosApi.cobertura(epsValue, nombres);
    setLoadingCobertura(false);

    if (error) {
      setToast({ message: error, type: "error" });
      return meds;
    }

    return mergeMedicamentosWithCobertura(meds, data ?? []);
  }

  useEffect(() => {
    let active = true;

    void (async () => {
      setLoading(true);
      const { data, error } = await historialesApi.get(historialId);
      if (!active) return;

      if (error || !data) {
        setLoading(false);
        setToast({ message: error ?? "Historial no encontrado", type: "error" });
        return;
      }

      const epsValue = resolveEps(searchParams, data);
      setEps(epsValue);

      const meds = await refreshCobertura(data.medicamentos ?? [], epsValue);
      if (!active) return;

      setHistorial({ ...data, medicamentos: meds, paciente_eps: epsValue });
      setLoading(false);
      saveAfterBooking({ historialId, eps: epsValue });
    })();

    return () => {
      active = false;
    };
  }, [historialId, searchParams]);

  async function guardar() {
    setSaving(true);
    const payload = { ...historial, paciente_eps: eps };
    const { error } = await historialesApi.update(historialId, payload);
    setSaving(false);
    setToast({
      message: error ? error : "Historial guardado",
      type: error ? "error" : "success",
    });
  }

  async function handleRefreshCobertura() {
    const meds = await refreshCobertura(historial.medicamentos ?? [], eps);
    setHistorial((prev) => ({ ...prev, medicamentos: meds, paciente_eps: eps }));
    setToast({ message: "Disponibilidad actualizada", type: "success" });
  }

  async function firmarYDescargar() {
    setSaving(true);
    const payload = { ...historial, paciente_eps: eps };
    const { error: errSave } = await historialesApi.update(historialId, payload);
    if (errSave) {
      setSaving(false);
      setToast({ message: errSave, type: "error" });
      return;
    }

    const { error: errFirmar } = await historialesApi.firmar(historialId);
    if (errFirmar) {
      setSaving(false);
      setToast({ message: errFirmar, type: "error" });
      return;
    }

    const { data: blob, error: errPdf } =
      await historialesApi.downloadPdf(historialId);
    setSaving(false);

    if (errPdf || !blob) {
      setToast({ message: errPdf ?? "Error al descargar PDF", type: "error" });
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historial-${historialId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

    setHistorial((h) => ({ ...h, firmado: true }));
    setToast({ message: "Historial firmado y PDF descargado", type: "success" });
  }

  if (loading) {
    return (
      <p className="historial-page__loading" role="status">
        Cargando historial generado por IA…
      </p>
    );
  }

  const readonly = historial.firmado;

  return (
    <div className="mn-page historial-page">
      <header className="historial-page__hero">
        <div className="mn-page__hero">
          <h2>Revisión del historial #{historialId}</h2>
          <p>
            Documento formateado devuelto por el backend tras la consulta. Edita,
            confirma y descarga el PDF.
          </p>
        </div>
        {readonly && <span className="historial-page__badge">Firmado</span>}
      </header>

      <Link to="/historial" className="historial-page__back">
        ← Volver a pacientes
      </Link>

      <div className="mn-panel">
        <HistorialEditor
          historial={historial}
          onChange={setHistorial}
          disabled={readonly}
        />
      </div>

      <MedicamentosSection
        medicamentos={historial.medicamentos ?? []}
        eps={eps}
        onChange={(meds) => setHistorial((prev) => ({ ...prev, medicamentos: meds }))}
        onRefreshCobertura={() => void handleRefreshCobertura()}
        loadingCobertura={loadingCobertura}
        disabled={readonly}
      />

      <footer className="mn-footer-actions">
        <Button variant="secondary" onClick={() => void guardar()} disabled={readonly || saving}>
          Guardar borrador
        </Button>
        <Button onClick={() => void firmarYDescargar()} disabled={readonly || saving}>
          {saving ? "Procesando…" : "Firmar y descargar PDF"}
        </Button>
      </footer>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
}
