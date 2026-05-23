import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { citasApi } from "@/api/citas";
import { medicosApi } from "@/api/medicos";
import { pacientesApi } from "@/api/pacientes";
import { CitaResumen } from "@/components/agendar/CitaResumen";
import { MedicoList } from "@/components/agendar/MedicoList";
import { PacienteForm } from "@/components/agendar/PacienteForm";
import { SlotPicker } from "@/components/agendar/SlotPicker";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useSlots } from "@/hooks/useSlots";
import type { Medico, Paciente, Slot } from "@/types/agendar";
import {
  findMedicoForDeepLink,
  parseBookingDeepLink,
} from "@/utils/deepLink";
import { emptyPaciente } from "@/utils/pacienteDefaults";
import {
  clearPendingBooking,
  readPendingBooking,
  saveAfterBooking,
} from "@/utils/session";
import { validatePaciente } from "@/utils/validatePaciente";
import { CONSULT_STORAGE_KEYS } from "@/types/consult";
import "./AgendarPage.css";

const STEPS = ["Médico", "Horario", "Paciente", "Confirmar"];

export function AgendarPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const deepLink = useMemo(() => {
    const pending = readPendingBooking();
    const params = parseBookingDeepLink(searchParams, pending);
    if (pending) clearPendingBooking();
    return params;
  }, [searchParams]);

  const [step, setStep] = useState(0);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loadingMedicos, setLoadingMedicos] = useState(true);
  const [medico, setMedico] = useState<Medico | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [paciente, setPaciente] = useState<Paciente>(emptyPaciente);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "info" | "success" | "error";
  }>({ message: "", type: "info" });
  const [fe1Hint, setFe1Hint] = useState<string | null>(null);
  const [pacienteErrors, setPacienteErrors] = useState<
    Partial<Record<keyof Paciente, string>>
  >({});

  const medicoDeepLinkDone = useRef(false);
  const slotDeepLinkDone = useRef(false);

  const { slots, loading: loadingSlots, error: slotsError } = useSlots(
    medico?.id ?? null
  );

  useEffect(() => {
    void (async () => {
      setLoadingMedicos(true);
      const { data, error } = await medicosApi.list();
      setLoadingMedicos(false);
      if (error) {
        setToast({ message: error, type: "error" });
        return;
      }
      setMedicos(data ?? []);
    })();
  }, []);

  useEffect(() => {
    if (loadingMedicos || !medicos.length || medicoDeepLinkDone.current) return;
    if (!deepLink.medicoId && !deepLink.especialidad && !deepLink.eps) return;

    const selected = findMedicoForDeepLink(medicos, deepLink);
    if (selected) {
      setMedico(selected);
      if (deepLink.eps) {
        setPaciente((p) => ({ ...p, eps: deepLink.eps! }));
      }
      if (deepLink.fromChat) {
        setFe1Hint("Sugerencia del asistente aplicada. Revisa médico y horario.");
      }
    } else if (deepLink.medicoId) {
      setToast({ message: "Médico sugerido no encontrado", type: "error" });
    }
    medicoDeepLinkDone.current = true;
  }, [loadingMedicos, medicos, deepLink]);

  useEffect(() => {
    if (!medico || loadingSlots || slotDeepLinkDone.current) return;

    if (!deepLink.slotId) {
      if (medicoDeepLinkDone.current) setStep(1);
      return;
    }

    const found = slots.find((s) => s.id === deepLink.slotId);
    if (found) {
      setSlot(found);
      setStep(2);
      setFe1Hint((h) => h ?? "Horario sugerido preseleccionado.");
    } else if (slots.length) {
      setToast({ message: "El horario sugerido ya no está disponible", type: "error" });
      setStep(1);
    }
    slotDeepLinkDone.current = true;
  }, [medico, slots, loadingSlots, deepLink]);

  async function confirmarCita() {
    if (!medico || !slot) return;
    setSubmitting(true);

    const { data: pac, error: errPac } = await pacientesApi.create(paciente);
    if (errPac || !pac?.id) {
      setSubmitting(false);
      setToast({ message: errPac ?? "Error al crear paciente", type: "error" });
      return;
    }

    const { data: cita, error: errCita } = await citasApi.create({
      paciente_id: pac.id,
      medico_id: medico.id,
      slot_id: slot.id,
    });
    setSubmitting(false);

    if (errCita || !cita) {
      setToast({ message: errCita ?? "Error al crear cita", type: "error" });
      return;
    }

    const historialId = cita.historial_id ?? cita.id;
    saveAfterBooking({ historialId, eps: paciente.eps });

    sessionStorage.setItem(CONSULT_STORAGE_KEYS.pacienteId, `pac-${pac.id}`);
    sessionStorage.setItem(CONSULT_STORAGE_KEYS.citaId, `cita-${cita.id}`);

    setToast({
      message: `Cita #${cita.id} confirmada. Redirigiendo a consulta…`,
      type: "success",
    });
    setTimeout(() => {
      navigate("/consultas");
    }, 1200);
  }

  function canNext() {
    if (step === 0) return !!medico;
    if (step === 1) return !!slot;
    if (step === 2) return validatePaciente(paciente).valid;
    return true;
  }

  function goNext() {
    if (step === 2) {
      const { valid, errors } = validatePaciente(paciente);
      setPacienteErrors(errors);
      if (!valid) {
        setToast({ message: "Revisa los datos del paciente", type: "error" });
        return;
      }
    }
    setStep((s) => s + 1);
  }

  return (
    <div className="mn-page agendar-page">
      <header className="mn-page__hero">
        <h2>Agendar cita médica</h2>
        <p>Selecciona médico, horario y datos del paciente (FE2).</p>
      </header>

      {fe1Hint && <div className="mn-banner" role="status">{fe1Hint}</div>}

      <ol className="mn-steps" aria-label="Pasos de agendación">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={i <= step ? "mn-steps__done" : ""}
            aria-current={i === step ? "step" : undefined}
          >
            <span>{i + 1}</span> {label}
          </li>
        ))}
      </ol>

      <section className="mn-panel">
        {step === 0 && (
          <MedicoList
            medicos={medicos}
            selectedId={medico?.id}
            onSelect={(m) => {
              setMedico(m);
              setSlot(null);
              slotDeepLinkDone.current = true;
            }}
            loading={loadingMedicos}
          />
        )}
        {step === 1 && medico && (
          <SlotPicker
            slots={slots}
            selectedId={slot?.id}
            onSelect={setSlot}
            loading={loadingSlots}
            error={slotsError}
          />
        )}
        {step === 2 && (
          <PacienteForm
            value={paciente}
            onChange={(p) => {
              setPaciente(p);
              setPacienteErrors({});
            }}
            errors={pacienteErrors}
          />
        )}
        {step === 3 && medico && slot && (
          <CitaResumen medico={medico} slot={slot} paciente={paciente} />
        )}
      </section>

      <footer className="mn-footer-actions">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
            Atrás
          </Button>
        )}
        {step < 3 ? (
          <Button disabled={!canNext()} onClick={goNext}>
            Siguiente
          </Button>
        ) : (
          <Button disabled={submitting} onClick={() => void confirmarCita()}>
            {submitting ? "Confirmando…" : "Confirmar cita"}
          </Button>
        )}
      </footer>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "info" })}
      />
    </div>
  );
}
