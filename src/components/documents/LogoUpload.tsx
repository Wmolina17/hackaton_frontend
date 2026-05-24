import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import "./LogoUpload.css";

interface LogoUploadProps {
  logoDataUrl: string | null;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function LogoUpload({ logoDataUrl, onUpload, onRemove, disabled }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onUpload(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="logo-upload">
      <div className="logo-upload__preview">
        {logoDataUrl ? (
          <img src={logoDataUrl} alt="Logo de la clínica" />
        ) : (
          <span className="logo-upload__placeholder">Sin logo</span>
        )}
      </div>
      {!disabled && (
        <div className="logo-upload__actions">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="logo-upload__input"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button
            variant="secondary"
            type="button"
            onClick={() => inputRef.current?.click()}
          >
            Subir logo
          </Button>
          {logoDataUrl && (
            <button type="button" className="logo-upload__remove" onClick={onRemove}>
              Quitar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
