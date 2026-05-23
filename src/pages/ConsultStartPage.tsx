import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { citasCalendarioApi } from "@/api/citas-calendario";
import { ActiveCitaCard } from "@/components/consult/ActiveCitaCard";
import { ConsultHero } from "@/components/consult/ConsultHero";
import { Button } from "@/components/ui/Button";
import { WaveformVisualizer } from "@/components/ui/WaveformVisualizer";
import { useAudio } from "@/hooks/useAudio";
import type { CitaActiva } from "@/types/consult";
import { CONSULT_STORAGE_KEYS } from "@/types/consult";
import "./ConsultStartPage.css";

export function ConsultStartPage() {
  const { citaId } = useParams();
  const navigate = useNavigate();
  const { frequencyData, startPreview, stopPreview } = useAudio();
  const [cita, setCita] = useState<CitaActiva | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void startPreview();
    return () => {
      stopPreview();
    };
  }, [startPreview, stopPreview]);

  useEffect(() => {
    if (!citaId) {
      navigate("/consultas", { replace: true });
      return;
    }
    void (async () => {
      const { data, error } = await citasCalendarioApi.get(citaId);
      if (error || !data) {
        setLoadError(error || "Cita no encontrada");
      } else {
        const citaActiva: CitaActiva = {
          id: data.id,
          paciente_id: data.paciente_id,
          paciente_nombre: data.paciente_nombre,
          medico_nombre: data.medico_nombre,
          especialidad: data.especialidad,
          fecha_hora: data.fecha_hora,
          estado: data.estado,
        };
        setCita(citaActiva);
        sessionStorage.setItem(CONSULT_STORAGE_KEYS.pacienteId, data.paciente_id);
        sessionStorage.setItem(CONSULT_STORAGE_KEYS.citaId, data.id);
      }
      setLoading(false);
    })();
  }, [citaId, navigate]);

  const handleStart = () => {
    if (!cita || !citaId) return;
    stopPreview();
    navigate(`/consulta/${citaId}/chat`);
  };

  return (
    <div className="consult-start">
      <div className="consult-start__content">
        <ConsultHero
          title={cita ? cita.paciente_nombre : "Confirmar consulta"}
          subtitle="Revisa los datos del paciente y pulsa iniciar cuando estés listo para grabar la consulta."
        />
        {loading && <p className="consult-start__loading">Cargando cita…</p>}
        {loadError && (
          <p className="consult-start__error" role="alert">
            {loadError}
          </p>
        )}
        {cita && <ActiveCitaCard cita={cita} />}
        <div className="consult-start__wave">
          <WaveformVisualizer frequencyData={frequencyData} />
        </div>
        <Button onClick={handleStart} disabled={!cita || loading}>
          Iniciar consulta
        </Button>
        <p className="consult-start__hint">
          La grabación será continua hasta que pulses «Terminar consulta».
        </p>
      </div>
    </div>
  );
}
