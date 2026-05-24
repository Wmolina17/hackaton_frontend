import type { MedicoConfig } from "@/types/documents";

const STORAGE_PREFIX = "medinote:medico-config:";

/** Capa de persistencia local — reemplazable por API/DB sin cambiar componentes. */
export const medicoConfigStorage = {
  key(medicoId: number): string {
    return `${STORAGE_PREFIX}${medicoId}`;
  },

  load(medicoId: number): MedicoConfig | null {
    try {
      const raw = localStorage.getItem(this.key(medicoId));
      if (!raw) return null;
      return JSON.parse(raw) as MedicoConfig;
    } catch {
      return null;
    }
  },

  save(config: MedicoConfig): void {
    localStorage.setItem(this.key(config.medicoId), JSON.stringify(config));
    window.dispatchEvent(
      new CustomEvent("medinote:medico-config", { detail: config })
    );
  },

  /** Reservado para migración futura a backend. */
  async persistToBackend(_config: MedicoConfig): Promise<void> {
    // TODO: POST /medicos/:id/config cuando exista el endpoint
  },
};
