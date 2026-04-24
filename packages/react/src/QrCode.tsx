import { useEffect, useRef, useState } from "react";
import { generateQrOnCanvas } from "@convertprivately/core/qr";
import { AttributionBadge } from "./AttributionBadge.js";

export interface QrCodeProps {
  hideAttribution?: boolean;
  defaultText?: string;
  size?: number;
  className?: string;
}

export function QrCode({
  hideAttribution,
  defaultText = "https://convertprivately.com",
  size = 256,
  className,
}: QrCodeProps) {
  const [text, setText] = useState(defaultText);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !text) return;
    generateQrOnCanvas(canvasRef.current, text, { size }).then(
      () => setError(null),
      (e: Error) => setError(e.message),
    );
  }, [text, size]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className={`cp-tool cp-qr-code ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <textarea
        className="cp-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="URL or text to encode"
        rows={3}
        style={{ width: "100%", fontFamily: "monospace" }}
      />

      {error && <p className="cp-error" style={{ color: "#dc2626" }}>{error}</p>}

      <canvas ref={canvasRef} style={{ display: "block" }} />

      <button type="button" className="cp-button cp-button-active" onClick={handleDownload}>
        Download PNG
      </button>
    </div>
  );
}
