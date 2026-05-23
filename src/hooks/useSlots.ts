import { useEffect, useState } from "react";
import { medicosApi } from "@/api/medicos";
import type { Slot } from "@/types/agendar";

export function useSlots(medicoId: number | null) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!medicoId) return;

    let active = true;

    void (async () => {
      setLoading(true);
      setError(null);
      const { data, error: err } = await medicosApi.slots(medicoId);
      if (!active) return;
      setLoading(false);
      if (err) {
        setError(err);
        setSlots([]);
        return;
      }
      setSlots(data ?? []);
    })();

    return () => {
      active = false;
    };
  }, [medicoId]);

  return {
    slots: medicoId ? slots : [],
    loading: medicoId ? loading : false,
    error: medicoId ? error : null,
  };
}
