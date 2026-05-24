import { useState, type FormEvent, type KeyboardEvent } from "react";
import { AudioRecordButton } from "@/components/ui/AudioRecordButton";
import type { ConsultStatus } from "@/types/consult";
import "./ChatInput.css";

interface ChatInputProps {
  status: ConsultStatus;
  disabled?: boolean;
  onSend: (message: string) => void;
  onRecordStart: () => void;
  onRecordStop: () => void;
}

export function ChatInput({
  status,
  disabled = false,
  onSend,
  onRecordStart,
  onRecordStop,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const isBusy = disabled || status === "processing";

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    onSend(trimmed);
    setText("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <AudioRecordButton
        status={status}
        disabled={disabled}
        onStart={onRecordStart}
        onStop={onRecordStop}
      />
      <textarea
        className="chat-input__field"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje…"
        rows={1}
        disabled={isBusy}
        aria-label="Mensaje de texto"
      />
      <button
        type="submit"
        className="chat-input__send"
        disabled={isBusy || !text.trim()}
      >
        Enviar
      </button>
    </form>
  );
}
