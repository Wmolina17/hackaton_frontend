import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { medicoConfigStorage } from "@/services/medicoConfigStorage";
import type { MedicoConfig } from "@/types/documents";

function createDefaultConfig(
  medicoId: number,
  nombre: string,
  especialidad: string
): MedicoConfig {
  return {
    medicoId,
    nombre,
    especialidad,
    registroMedico: "RM-123456",
    clinica: "Clínica MediNote",
    logoDataUrl: null,
    firmaDataUrl: null,
  };
}

export function useMedicoConfig() {
  const { user } = useAuth();
  const medicoId = user?.medicoId ?? 1;

  const [config, setConfig] = useState<MedicoConfig>(() => {
    const stored = medicoConfigStorage.load(medicoId);
    if (stored) return stored;
    return createDefaultConfig(
      medicoId,
      user?.medicoNombre ?? "Médico",
      user?.medicoEspecialidad ?? "Medicina general"
    );
  });

  useEffect(() => {
    const stored = medicoConfigStorage.load(medicoId);
    if (stored) {
      setConfig(stored);
    } else if (user) {
      setConfig(
        createDefaultConfig(
          medicoId,
          user.medicoNombre ?? "Médico",
          user.medicoEspecialidad ?? "Medicina general"
        )
      );
    }
  }, [medicoId, user]);

  useEffect(() => {
    function onStorage(e: Event) {
      const detail = (e as CustomEvent<MedicoConfig>).detail;
      if (detail?.medicoId === medicoId) setConfig(detail);
    }
    window.addEventListener("medinote:medico-config", onStorage);
    return () => window.removeEventListener("medinote:medico-config", onStorage);
  }, [medicoId]);

  const updateConfig = useCallback(
    (patch: Partial<MedicoConfig>) => {
      setConfig((prev) => {
        const next = { ...prev, ...patch, medicoId };
        medicoConfigStorage.save(next);
        return next;
      });
    },
    [medicoId]
  );

  const hasSignature = useMemo(
    () => Boolean(config.firmaDataUrl?.length),
    [config.firmaDataUrl]
  );

  return { config, updateConfig, hasSignature };
}
