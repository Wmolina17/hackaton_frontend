import { ChatPanel } from "@/features/chat/ChatPanel";
import "./AgendarPage.css";

/** Pantalla principal de agendación — asistente IA (como en main remoto). */
export function AgendarPage() {
  return (
    <div className="agendar-page agendar-page--chat">
      <ChatPanel />
    </div>
  );
}
