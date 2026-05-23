import { emptyPaciente } from "@/utils/pacienteDefaults";
import type { Paciente } from "@/types/agendar";
import "./PacienteForm.css";

interface PacienteFormProps {
  value: Paciente;
  onChange: (paciente: Paciente) => void;
  errors?: Partial<Record<keyof Paciente, string>>;
  hideEps?: boolean;
}

export function PacienteForm({
  value,
  onChange,
  errors = {},
  hideEps = true,
}: PacienteFormProps) {
  const data = value ?? emptyPaciente;

  function update(field: keyof Paciente, val: string) {
    onChange({ ...data, [field]: val });
  }

  return (
    <form className="paciente-form" onSubmit={(e) => e.preventDefault()}>
      <label>
        Documento
        <input
          type="text"
          value={data.documento}
          onChange={(e) => update("documento", e.target.value)}
          placeholder="CC o TI"
        />
        {errors.documento && (
          <span className="paciente-form__error">{errors.documento}</span>
        )}
      </label>
      <label>
        Nombre completo
        <input
          type="text"
          value={data.nombre}
          onChange={(e) => update("nombre", e.target.value)}
          placeholder="Nombre del paciente"
        />
        {errors.nombre && (
          <span className="paciente-form__error">{errors.nombre}</span>
        )}
      </label>
      <label>
        Teléfono
        <input
          type="tel"
          value={data.telefono}
          onChange={(e) => update("telefono", e.target.value)}
          placeholder="3001234567"
        />
        {errors.telefono && (
          <span className="paciente-form__error">{errors.telefono}</span>
        )}
      </label>
      {!hideEps && (
        <label>
          EPS
          <select value={data.eps} onChange={(e) => update("eps", e.target.value)}>
            <option value="Sura">Sura</option>
            <option value="Sanitas">Sanitas</option>
            <option value="Nueva EPS">Nueva EPS</option>
            <option value="Salud Total">Salud Total</option>
            <option value="Compensar">Compensar</option>
          </select>
        </label>
      )}
    </form>
  );
}
