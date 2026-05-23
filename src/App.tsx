import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AgendarPage } from "@/pages/AgendarPage";
import { ConsultChatPage } from "@/pages/ConsultChatPage";
import { ConsultStartPage } from "@/pages/ConsultStartPage";
import { ConsultasPage } from "@/pages/ConsultasPage";
import { HistorialEditorPage } from "@/pages/HistorialEditorPage";
import { LandingPage } from "@/pages/LandingPage";
import { PacienteDetallePage } from "@/pages/PacienteDetallePage";
import { PacientesListPage } from "@/pages/PacientesListPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="/agendar" element={<AgendarPage />} />
          <Route path="/consultas" element={<ConsultasPage />} />
          <Route path="/consulta/:citaId" element={<ConsultStartPage />} />
          <Route path="/consulta/:citaId/chat" element={<ConsultChatPage />} />
          <Route path="/historial" element={<PacientesListPage />} />
          <Route path="/historial/paciente/:pacienteId" element={<PacienteDetallePage />} />
          <Route path="/historial/editar/:id" element={<HistorialEditorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
