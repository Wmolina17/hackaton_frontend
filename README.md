# Frontend

App web con **React + Vite + TypeScript**.

## Estructura

```
frontend/
├── src/
│   ├── main.tsx              # Punto de entrada
│   ├── App.tsx               # Router principal
│   ├── api/                  # Cliente HTTP y endpoints
│   ├── components/
│   │   ├── layout/           # Header, Layout, Sidebar...
│   │   └── ui/               # Botones, inputs, modals reutilizables
│   ├── pages/                # Una carpeta/archivo por vista
│   ├── hooks/                # Custom hooks
│   ├── context/              # Estado global (Context API)
│   ├── types/                # Tipos TypeScript compartidos
│   ├── styles/               # CSS global
│   └── utils/                # Helpers reutilizables
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

### Cómo agregar una nueva página (ej: `Users`)

1. Crear `src/pages/UsersPage.tsx` (+ CSS si hace falta)
2. Crear `src/api/users.ts` con las llamadas al API
3. Agregar tipos en `src/types/` si son nuevos
4. Registrar ruta en `src/App.tsx`:
   ```tsx
   <Route path="/users" element={<UsersPage />} />
   ```

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App disponible en `http://localhost:5173`

El proxy de Vite redirige `/api/*` al backend en `localhost:3001`.

## Scripts

- `npm run dev` — Desarrollo con hot reload
- `npm run build` — Build de producción
- `npm run preview` — Preview del build
- `npm run lint` — Verificar tipos
