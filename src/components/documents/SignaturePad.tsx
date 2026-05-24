import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useSignaturePad } from "@/hooks/useSignaturePad";
import "./SignaturePad.css";

interface SignaturePadProps {
  savedDataUrl: string | null;
  onSave: (dataUrl: string) => void;
  disabled?: boolean;
}

export function SignaturePad({ savedDataUrl, onSave, disabled }: SignaturePadProps) {
  const { canvasRef, isEmpty, clear, toDataUrl, loadFromDataUrl } = useSignaturePad({
    width: 480,
    height: 160,
  });

  useEffect(() => {
    loadFromDataUrl(savedDataUrl);
  }, [savedDataUrl, loadFromDataUrl]);

  function handleSave() {
    const dataUrl = toDataUrl();
    if (dataUrl) onSave(dataUrl);
  }

  return (
    <section className="signature-pad" aria-labelledby="signature-heading">
      <div className="signature-pad__head">
        <div>
          <h3 id="signature-heading">Firma digital</h3>
          <p>Dibuja tu firma con mouse o touch. Se incluirá en todos los documentos.</p>
        </div>
        {savedDataUrl && !disabled && (
          <span className="signature-pad__saved">Firma guardada</span>
        )}
      </div>

      <div className={`signature-pad__canvas-wrap ${disabled ? "signature-pad__canvas-wrap--disabled" : ""}`}>
        <canvas ref={canvasRef} className="signature-pad__canvas" aria-label="Área de firma" />
      </div>

      {!disabled && (
        <div className="signature-pad__actions">
          <Button variant="secondary" type="button" onClick={clear}>
            Limpiar
          </Button>
          <Button type="button" onClick={handleSave} disabled={isEmpty}>
            Guardar firma
          </Button>
        </div>
      )}
    </section>
  );
}
