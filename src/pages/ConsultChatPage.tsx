import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { consultasApi } from "@/api/consultas";
import { MOCK_CITA_ACTIVA } from "@/api/mock/consultas.mock";
import { ActiveCitaCard } from "@/components/consult/ActiveCitaCard";
import { HistorialPreview } from "@/components/consult/HistorialPreview";
import { Button } from "@/components/ui/Button";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { TranscriptPanel } from "@/components/ui/TranscriptPanel";
import { WaveformVisualizer } from "@/components/ui/WaveformVisualizer";
import { useAudio } from "@/hooks/useAudio";
import type { HistorialMedico } from "@/types/consult";
import { CONSULT_STORAGE_KEYS } from "@/types/consult";
import { saveAfterBooking, getLastEps } from "@/utils/session";
import "./ConsultChatPage.css";

export function ConsultChatPage() {
  const { citaId: routeCitaId } = useParams();
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState<string | null>(null);
  const [historial, setHistorial] = useState<HistorialMedico | null>(null);
  const [consultaId, setConsultaId] = useState<string | null>(null);
  const [historialId, setHistorialId] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const pendingProcessRef = useRef(false);
  const hasStartedRef = useRef(false);

  const pacienteId = sessionStorage.getItem(CONSULT_STORAGE_KEYS.pacienteId);
  const storedCitaId = sessionStorage.getItem(CONSULT_STORAGE_KEYS.citaId);

  const {
    status,
    error,
    frequencyData,
    audioBlob,
    startRecording,
    stopRecording,
    setIdle,
    setFailed,
  } = useAudio();

  useEffect(() => {
    if (!pacienteId || !storedCitaId) {
      navigate(routeCitaId ? `/consulta/${routeCitaId}` : "/consultas", { replace: true });
      return;
    }
    if (routeCitaId && routeCitaId !== storedCitaId) {
      navigate(`/consulta/${routeCitaId}`, { replace: true });
    }
  }, [pacienteId, storedCitaId, routeCitaId, navigate]);

  useEffect(() => {
    if (!pacienteId || !storedCitaId || hasStartedRef.current || isFinished) return;
    hasStartedRef.current = true;
    void startRecording();
  }, [pacienteId, storedCitaId, isFinished, startRecording]);

  const handleProcess = useCallback(
    async (blob: Blob) => {
      if (!pacienteId || !storedCitaId) return;

      const { data, error } = await consultasApi.processar(
        blob,
        pacienteId,
        storedCitaId
      );

      if (error || !data?.transcripcion || !data.historial) {
        setFailed(
          error || "No se recibió la respuesta de procesamiento."
        );
        pendingProcessRef.current = false;
        return;
      }

      setTranscript(data.transcripcion);
      setHistorial(data.historial);
      setConsultaId(data.consulta_id);
      setHistorialId(data.historial_id);
      saveAfterBooking({
        historialId: data.historial_id,
        eps: getLastEps() || "Sura",
      });
      setIsFinished(true);
      setIdle();
      pendingProcessRef.current = false;
    },
    [pacienteId, storedCitaId, setFailed, setIdle]
  );

  useEffect(() => {
    if (!audioBlob || !pendingProcessRef.current) return;
    void handleProcess(audioBlob);
  }, [audioBlob, handleProcess]);

  const handleTerminar = () => {
    if (status !== "listening" || isFinished) return;
    pendingProcessRef.current = true;
    stopRecording();
  };

  const citaDisplay = {
    ...MOCK_CITA_ACTIVA,
    id: storedCitaId ?? MOCK_CITA_ACTIVA.id,
    paciente_id: pacienteId ?? MOCK_CITA_ACTIVA.paciente_id,
    estado: isFinished ? ("terminada" as const) : ("activa" as const),
  };

  return (
    <div className="consult-chat">
      <div className="consult-chat__glow" aria-hidden="true" />
      <div className="consult-chat__card">
        <header className="consult-chat__header">
          <div>
            <h1 className="consult-chat__title">Consulta en curso</h1>
            <p className="consult-chat__subtitle">
              {isFinished
                ? "Audio procesado — historial listo para revisión (FE2)"
                : "Habla con el paciente con normalidad"}
            </p>
          </div>
          <StatusIndicator status={status} error={error} />
        </header>

        <ActiveCitaCard cita={citaDisplay} />

        {!isFinished && (
          <div className="consult-chat__recording">
            <WaveformVisualizer frequencyData={frequencyData} />
            <button
              type="button"
              className="consult-chat__finish"
              onClick={handleTerminar}
              disabled={status !== "listening"}
            >
              Terminar consulta
            </button>
          </div>
        )}

        <TranscriptPanel transcript={transcript} />

        {historial && <HistorialPreview historial={historial} />}

        {isFinished && historialId && (
          <div className="consult-chat__actions">
            <p className="consult-chat__done">
              Consulta registrada · <code>{consultaId}</code>
            </p>
            <Link to={`/historial/editar/${historialId}`}>
              <Button>Revisar y editar historial</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
