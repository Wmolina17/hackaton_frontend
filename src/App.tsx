import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { AgendarPage } from "@/pages/AgendarPage";
import { ConsultChatPage } from "@/pages/ConsultChatPage";
import { ConsultStartPage } from "@/pages/ConsultStartPage";
import { ConsultasPage } from "@/pages/ConsultasPage";
import { HistorialEditorPage } from "@/pages/HistorialEditorPage";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { MedicamentosPage } from "@/pages/MedicamentosPage";
import { MiHistorialPage } from "@/pages/MiHistorialPage";
import { PacienteDetallePage } from "@/pages/PacienteDetallePage";
import { PacientesListPage } from "@/pages/PacientesListPage";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/acceso" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/agendar"
              element={
                <ProtectedRoute roles={["cliente"]}>
                  <AgendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mi-historial"
              element={
                <ProtectedRoute roles={["cliente"]}>
                  <MiHistorialPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consultas"
              element={
                <ProtectedRoute roles={["medico"]}>
                  <ConsultasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consulta/:citaId"
              element={
                <ProtectedRoute roles={["medico"]}>
                  <ConsultStartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/consulta/:citaId/chat"
              element={
                <ProtectedRoute roles={["medico"]}>
                  <ConsultChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/historial"
              element={
                <ProtectedRoute roles={["medico"]}>
                  <PacientesListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/historial/paciente/:pacienteId"
              element={
                <ProtectedRoute roles={["medico"]}>
                  <PacienteDetallePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/historial/editar/:id"
              element={
                <ProtectedRoute roles={["medico"]}>
                  <HistorialEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medicamentos"
              element={
                <ProtectedRoute roles={["medico"]}>
                  <MedicamentosPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
