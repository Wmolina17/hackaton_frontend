export interface Medico {
  id: number;
  nombre: string;
  especialidad: string;
  eps?: string;
}

export interface Slot {
  id: number;
  datetime: string;
}

export interface Paciente {
  id?: number;
  documento: string;
  nombre: string;
  telefono: string;
  eps: string;
}

export interface Cita {
  id: number;
  paciente_id: number;
  medico_id: number;
  slot_id: number;
  historial_id: number;
  estado: string;
}

export interface BookingDeepLink {
  medicoId: number | null;
  slotId: number | null;
  eps: string | null;
  especialidad: string | null;
  fromChat: boolean;
}
