import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { pacientesListApi } from "@/api/pacientes";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import type { PacienteDetalle } from "@/types/pacientes";
import "./PacienteDetallePage.css";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function PacienteDetallePage() {
  const { pacienteId } = useParams();
  const { user } = useAuth();
  const isMedico = user?.role === "medico";
  const isCliente = user?.role === "cliente";

  const [paciente, setPaciente] = useState<PacienteDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "info" | "success" | "error";
  }>({ message: "", type: "info" });

  useEffect(() => {
    if (!pacienteId) return;
    setLoading(true);
    void (async () => {
      const { data, error } = await pacientesListApi.get(pacienteId);
      if (data) setPaciente(data);
      if (error) console.error(error);
      setLoading(false);
    })();
  }, [pacienteId]);

  if (isCliente && user?.pacienteId && pacienteId !== user.pacienteId) {
    return <Navigate to={`/historial/paciente/${user.pacienteId}`} replace />;
  }

  async function descargarHistorialPdf() {
    if (!pacienteId || !paciente) return;
    setDownloadingPdf(true);
    const { data: blob, error } = await pacientesListApi.downloadHistorialPdf(pacienteId);
    setDownloadingPdf(false);

    if (error || !blob) {
      setToast({ message: error ?? "No se pudo generar el PDF", type: "error" });
      return;
    }

    const slug = paciente.documento || pacienteId;
    downloadBlob(blob, `historial-clinico-${slug}.pdf`);
    setToast({ message: "PDF descargado", type: "success" });
  }

  if (loading) {
    return <p className="paciente-detalle__loading">Cargando historial…</p>;
  }

  if (!paciente) {
    return <p className="paciente-detalle__loading">Paciente no encontrado.</p>;
  }

  return (
    <div className="mn-page paciente-detalle">
      {isMedico && (
        <Link to="/historial" className="paciente-detalle__back">
          ← Todos los pacientes
        </Link>
      )}

      <header className="paciente-detalle__header mn-panel">
        <span className="paciente-detalle__avatar">{paciente.nombre.charAt(0)}</span>
        <div className="paciente-detalle__header-info">
          <h2>{isCliente ? "Mi historial clínico" : paciente.nombre}</h2>
          <p>
            CC {paciente.documento}
            {paciente.telefono ? ` · ${paciente.telefono}` : ""}
          </p>
          <p className="paciente-detalle__stats">
            {paciente.total_consultas} consultas registradas
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => void descargarHistorialPdf()}
          disabled={downloadingPdf}
        >
          {downloadingPdf ? "Generando PDF…" : "Descargar historial (PDF)"}
        </Button>
      </header>

      <section>
        <h3 className="paciente-detalle__section-title">Consultas anteriores</h3>
        <ul className="paciente-detalle__consultas">
          {paciente.consultas.map((c) => (
            <li key={c.id} className="mn-panel paciente-detalle__consulta-card">
              <div>
                <time dateTime={c.fecha}>
                  {new Date(c.fecha).toLocaleString("es-CO", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
                <p className="paciente-detalle__diag">{c.diagnostico}</p>
                <p className="paciente-detalle__medico">{c.medico_nombre}</p>
              </div>
              <Link
                to={`/historial/consulta/${c.historial_id}?paciente=${pacienteId}`}
              >
                <Button variant="secondary">Ver detalle</Button>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
}
