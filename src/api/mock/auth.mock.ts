import type { UserRole } from "@/context/AuthContext";

export interface MockAuthRecord {
  cedula: string;
  password: string;
  role: UserRole;
  pacienteId?: string;
  pacienteNombre?: string;
  medicoId?: number;
  medicoNombre?: string;
  medicoEspecialidad?: string;
}

/** Credenciales de demostración — reemplazar por backend más adelante. */
export const MOCK_AUTH_USERS: MockAuthRecord[] = [
  {
    cedula: "1023456789",
    password: "1234",
    role: "cliente",
    pacienteId: "pac-001",
    pacienteNombre: "María García López",
  },
  {
    cedula: "1098765432",
    password: "1234",
    role: "cliente",
    pacienteId: "pac-002",
    pacienteNombre: "Juan Pérez Ortiz",
  },
  {
    cedula: "52345678",
    password: "medico1",
    role: "medico",
    medicoId: 1,
    medicoNombre: "Dra. Ana Ruiz",
    medicoEspecialidad: "Medicina general",
  },
  {
    cedula: "87654321",
    password: "medico1",
    role: "medico",
    medicoId: 2,
    medicoNombre: "Dr. Carlos Mejía",
    medicoEspecialidad: "Medicina interna",
  },
];

export function findMockAuthUser(
  cedula: string,
  password: string
): MockAuthRecord | null {
  const normalized = cedula.trim();
  return (
    MOCK_AUTH_USERS.find(
      (u) => u.cedula === normalized && u.password === password
    ) ?? null
  );
}
