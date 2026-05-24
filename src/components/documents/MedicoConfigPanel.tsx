import type { MedicoConfig } from "@/types/documents";
import { LogoUpload } from "./LogoUpload";
import "./MedicoConfigPanel.css";

interface MedicoConfigPanelProps {
  config: MedicoConfig;
  onChange: (patch: Partial<MedicoConfig>) => void;
  disabled?: boolean;
}

export function MedicoConfigPanel({
  config,
  onChange,
  disabled,
}: MedicoConfigPanelProps) {
  return (
    <section className="medico-config" aria-labelledby="medico-config-heading">
      <h3 id="medico-config-heading">Datos profesionales y clínica</h3>
      <p className="medico-config__hint">
        Estos datos y el logo aparecerán en historia clínica, orden médica e incapacidad.
      </p>

      <div className="medico-config__grid">
        <label>
          Nombre del médico
          <input
            type="text"
            value={config.nombre}
            onChange={(e) => onChange({ nombre: e.target.value })}
            disabled={disabled}
          />
        </label>
        <label>
          Especialidad
          <input
            type="text"
            value={config.especialidad}
            onChange={(e) => onChange({ especialidad: e.target.value })}
            disabled={disabled}
          />
        </label>
        <label>
          Registro médico
          <input
            type="text"
            value={config.registroMedico}
            onChange={(e) => onChange({ registroMedico: e.target.value })}
            disabled={disabled}
          />
        </label>
        <label>
          Clínica / Hospital
          <input
            type="text"
            value={config.clinica}
            onChange={(e) => onChange({ clinica: e.target.value })}
            disabled={disabled}
          />
        </label>
      </div>

      <div className="medico-config__logo">
        <span className="medico-config__logo-label">Logo de la clínica</span>
        <LogoUpload
          logoDataUrl={config.logoDataUrl}
          onUpload={(dataUrl) => onChange({ logoDataUrl: dataUrl })}
          onRemove={() => onChange({ logoDataUrl: null })}
          disabled={disabled}
        />
      </div>
    </section>
  );
}
