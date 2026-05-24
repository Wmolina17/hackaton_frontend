import { useEffect, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { historialesApi } from "@/api/historiales";
import { ClinicalRecordView } from "@/components/historial/ClinicalRecordView";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { downloadBlob } from "@/services/clinicalDocuments";
import { createEmptyHistorial, type HistorialClinico } from "@/types/historial";
import "./HistorialConsultaPage.css";

export function HistorialConsultaPage() {
  const { historialId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const pacienteIdFromQuery = searchParams.get("paciente");

  const [historial, setHistorial] = useState<HistorialClinico>(createEmptyHistorial());
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "info" | "success" | "error";
  }>({ message: "", type: "info" });

  useEffect(() => {
    if (!historialId) return;
    setLoading(true);
    void (async () => {
      const { data, error } = await historialesApi.get(historialId);
      if (data) setHistorial(data);
      if (error) console.error(error);
      setLoading(false);
    })();
  }, [historialId]);

  const backPath = pacienteIdFromQuery
    ? `/historial/paciente/${pacienteIdFromQuery}`
    : user?.role === "cliente" && user.pacienteId
      ? `/historial/paciente/${user.pacienteId}`
      : "/historial";

  if (
    user?.role === "cliente" &&
    user.pacienteId &&
    pacienteIdFromQuery &&
    pacienteIdFromQuery !== user.pacienteId
  ) {
    return <Navigate to={`/historial/paciente/${user.pacienteId}`} replace />;
  }

  async function descargarPdf() {
    if (!historialId) return;
    setDownloading(true);
    const { data: blob, error } = await historialesApi.downloadPdf(historialId);
    setDownloading(false);
    if (error || !blob) {
      setToast({ message: error ?? "No se pudo descargar el PDF", type: "error" });
      return;
    }
    downloadBlob(blob, `historial-consulta-${historialId}.pdf`);
    setToast({ message: "PDF descargado", type: "success" });
  }

  if (loading) {
    return <p className="historial-consulta__loading">Cargando consulta…</p>;
  }

  return (
    <div className="mn-page historial-consulta">
      <Link to={backPath} className="historial-consulta__back">
        ← Volver al historial
      </Link>

      <ClinicalRecordView historial={historial} />

      <div className="clinical-record__actions">
        {historial.firmado && (
          <Button variant="secondary" onClick={() => void descargarPdf()} disabled={downloading}>
            {downloading ? "Descargando…" : "Descargar historia clínica (PDF)"}
          </Button>
        )}
        {user?.role === "medico" && !historial.firmado && (
          <Link to={`/historial/editar/${historialId}`}>
            <Button>Revisar y firmar</Button>
          </Link>
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
}
