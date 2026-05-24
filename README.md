# Frontend — Monwe

App unificada **FE1 (consulta/voz) + FE2 (agendar/historial)** con **React + Vite + TypeScript**.

## Rutas

| Ruta | Módulo |
|------|--------|
| `/` | Agendar cita (FE2) |
| `/consulta` | Iniciar consulta + cita activa (FE1) |
| `/consulta/chat` | Grabación y procesamiento de audio (FE1) |
| `/historial/:id` | Editar historial y descargar PDF (FE2) |

## Mocks (sin backend)

Con `VITE_USE_MOCK=true` (por defecto), **toda la data dummy vive en** `src/api/mock/router.ts`.  
Los módulos en `src/api/*.ts` solo definen rutas y contratos.

## Estructura

```
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── api/                  # Endpoints por dominio + http.ts + mock/
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/               # Button, Toast, waveform…
│   │   ├── agendar/          # FE2
│   │   ├── historial/        # FE2
│   │   └── consult/          # FE1
│   ├── pages/
│   ├── hooks/
│   ├── types/
│   ├── styles/               # theme.css + shared.css
│   └── utils/
├── index.html
├── vite.config.ts
└── package.json
```

## Convenciones del equipo

| Carpeta | Responsabilidad |
|---------|-----------------|
| `api/` | Todas las llamadas al backend (un archivo por módulo) |
| `components/ui/` | Componentes pequeños y reutilizables |
| `components/layout/` | Estructura de la app (header, nav, layout) |
| `pages/` | Vistas completas conectadas a rutas |
| `hooks/` | Lógica reutilizable con estado/efectos |
| `context/` | Estado compartido entre componentes |
| `types/` | Interfaces que coinciden con el backend |

### Alias de imports

Usa `@/` para importar desde `src/`:

```tsx
import { api } from "@/api/client";
import { HomePage } from "@/pages/HomePage";
```

## Flujo demo (Monwe)

1. **Agendar** (`/`) → médico, horario, paciente → confirma cita → redirige a **Consulta**
2. **Consulta** → Iniciar → grabar → Terminar → IA mock devuelve transcripción + historial
3. **Historial** → editar campos, cobertura EPS, firmar y descargar PDF mock

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App en `http://localhost:5173` — solo mocks, no requiere backend.

## Scripts

- `npm run dev` — Desarrollo con hot reload
- `npm run build` — Build de producción
- `npm run preview` — Preview del build
- `npm run lint` — Verificar tipos
