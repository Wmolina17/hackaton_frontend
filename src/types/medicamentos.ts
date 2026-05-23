export interface Medicamento {
  id: number;
  nombre: string;
  descripcion: string;
  nombre_generico: string | null;
  nombre_comercial: string | null;
  categoria: string | null;
  diagnosticos_aplica: string[] | null;
  disponible: boolean;
  eps_id: number;
  eps_nombre?: string;
}
