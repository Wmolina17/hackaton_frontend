import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { historialesApi } from "@/api/historiales";
import { medicamentosApi } from "@/api/medicamentos";
import { DocumentGeneratorPanel } from "@/components/documents/DocumentGeneratorPanel";
import { IncapacidadSection } from "@/components/documents/IncapacidadSection";
import { RadicadoIncapacidadPanel } from "@/components/documents/RadicadoIncapacidadPanel";
import { MedicoConfigPanel } from "@/components/documents/MedicoConfigPanel";
import { SignaturePad } from "@/components/documents/SignaturePad";
import { HistorialEditor } from "@/components/historial/HistorialEditor";
import { MedicamentosSection } from "@/components/historial/MedicamentosSection";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useMedicoConfig } from "@/hooks/useMedicoConfig";
import { createEmptyHistorial, type HistorialClinico } from "@/types/historial";
import { CONSULT_STORAGE_KEYS } from "@/types/consult";
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

function resolvePacienteId(): string {
  return sessionStorage.getItem(CONSULT_STORAGE_KEYS.pacienteId) ?? "pac-001";
}

export function HistorialEditorPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const historialId = id ?? "1";
  const pacienteId = resolvePacienteId();

  const { config: medicoConfig, updateConfig, hasSignature } = useMedicoConfig();

  const [historial, setHistorial] = useState<HistorialClinico>(createEmptyHistorial());
  const [eps, setEps] = useState("Sura");
  const [loading, setLoading] = useState(true);
  const [loadingCobertura, setLoadingCobertura] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "info" | "success" | "error";
  }>({ message: "", type: "info" });

  const coberturaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipCoberturaEffect = useRef(true);

  const refreshCobertura = useCallback(
    async (meds: HistorialClinico["medicamentos"], epsValue: string) => {
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
    },
    []
  );

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
  }, [historialId, searchParams, refreshCobertura]);

  const medicamentosKey = historial.medicamentos
    ?.map((m) => m.nombre.trim())
    .join("|");

  useEffect(() => {
    if (loading || historial.firmado) return;
    if (skipCoberturaEffect.current) {
      skipCoberturaEffect.current = false;
      return;
    }

    if (coberturaTimer.current) clearTimeout(coberturaTimer.current);

    coberturaTimer.current = setTimeout(() => {
      void (async () => {
        const meds = await refreshCobertura(historial.medicamentos ?? [], eps);
        setHistorial((prev) => ({ ...prev, medicamentos: meds, paciente_eps: eps }));
      })();
    }, 600);

    return () => {
      if (coberturaTimer.current) clearTimeout(coberturaTimer.current);
    };
  }, [medicamentosKey, eps, loading, historial.firmado, refreshCobertura]);

  async function firmarYEnviar() {
    if (!hasSignature) {
      setToast({
        message: "Debes guardar tu firma digital antes de enviar",
        type: "error",
      });
      return;
    }

    setSaving(true);
    const meds = await refreshCobertura(historial.medicamentos ?? [], eps);
    const payload = { ...historial, medicamentos: meds, paciente_eps: eps };

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

    const { error: errEnviar } = await historialesApi.enviarPaciente(historialId);
    setSaving(false);

    if (errEnviar) {
      setToast({ message: errEnviar, type: "error" });
      return;
    }

    setHistorial({ ...payload, firmado: true });
    setToast({
      message: "Historial firmado, documentos generados y enviados al paciente",
      type: "success",
    });
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
    <div className="mn-page historial-page historial-page--wide">
      <header className="historial-page__hero">
        <div className="mn-page__hero">
          <h2>Revisión del historial #{historialId}</h2>
          <p>
            Revisa la información clínica, configura tus datos profesionales, firma
            digitalmente y genera los documentos para el paciente.
          </p>
        </div>
        {readonly && <span className="historial-page__badge">Enviado</span>}
      </header>

      <Link to="/historial" className="historial-page__back">
        ← Volver a pacientes
      </Link>

      <div className="historial-page__grid">
        <div className="historial-page__editor-col">
          <div className="mn-panel">
            <HistorialEditor
              historial={historial}
              onChange={setHistorial}
              disabled={readonly}
            />
          </div>

          <MedicamentosSection
            medicamentos={historial.medicamentos ?? []}
            onChange={
              readonly
                ? undefined
                : (meds) => setHistorial((prev) => ({ ...prev, medicamentos: meds }))
            }
            loadingCobertura={loadingCobertura}
            disabled={readonly}
          />

          <IncapacidadSection
            historial={historial}
            onChange={setHistorial}
            disabled={readonly}
          />
        </div>

        <div className="historial-page__config-col">
          <MedicoConfigPanel
            config={medicoConfig}
            onChange={updateConfig}
            disabled={readonly}
          />

          <SignaturePad
            savedDataUrl={medicoConfig.firmaDataUrl}
            onSave={(dataUrl) => updateConfig({ firmaDataUrl: dataUrl })}
            disabled={readonly}
          />
        </div>
      </div>

      {(historial.incapacidad_dias ?? 0) > 0 && (
        <RadicadoIncapacidadPanel
          historialId={historialId}
          historial={historial}
          disabled={readonly}
          onToast={(message, type) => setToast({ message, type })}
        />
      )}

      <DocumentGeneratorPanel
        historial={historial}
        medico={medicoConfig}
        pacienteId={pacienteId}
      />

      <footer className="mn-footer-actions historial-page__footer">
        <Button onClick={() => void firmarYEnviar()} disabled={readonly || saving}>
          {saving ? "Enviando…" : "Firmar y enviar al paciente"}
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
