import { useRef, useState } from "react";
import { removeBackground } from "@convertprivately/core/image/background-remove";
import { AttributionBadge } from "./AttributionBadge.js";
import { triggerDownload, stripExtension } from "./utils.js";

export interface BackgroundRemoveProps {
  hideAttribution?: boolean;
  className?: string;
}

export function BackgroundRemove({ hideAttribution, className }: BackgroundRemoveProps) {
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [originalName, setOriginalName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    setError(null);
    setResultBlob(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setProgress(0);
    setStatus("processing");
    setOriginalName(stripExtension(file.name));
    try {
      const blob = await removeBackground(file, {
        onProgress: (p) => setProgress(p),
      });
      setResultBlob(blob);
      setPreview(URL.createObjectURL(blob));
      setStatus("done");
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  }

  return (
    <div className={`cp-tool cp-background-remove ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <p className="cp-note" style={{ fontSize: "0.75rem", color: "#6b7280" }}>
        First run downloads a ~20MB AI model. It is cached in your browser afterward.
      </p>

      <div
        className="cp-dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) processFile(file);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
        />
        {status === "processing"
          ? `Processing... ${Math.round(progress * 100)}%`
          : "Drop image or click to browse"}
      </div>

      {preview && (
        <div
          className="cp-preview"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
          }}
        >
          <img src={preview} alt="Background removed" style={{ maxWidth: "100%" }} />
        </div>
      )}

      {error && <p className="cp-error" style={{ color: "#dc2626" }}>{error}</p>}

      <button
        type="button"
        className="cp-button cp-button-active"
        disabled={!resultBlob}
        onClick={() => {
          if (resultBlob) triggerDownload(resultBlob, `${originalName || "image"}-nobg.png`);
        }}
      >
        Download PNG
      </button>
    </div>
  );
}
