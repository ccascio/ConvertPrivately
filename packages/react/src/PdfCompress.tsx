import { useRef, useState } from "react";
import { compressPdf } from "@convertprivately/core/pdf/compress";
import { AttributionBadge } from "./AttributionBadge.js";
import { triggerDownload, stripExtension } from "./utils.js";

export interface PdfCompressProps {
  hideAttribution?: boolean;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function PdfCompress({ hideAttribution, className }: PdfCompressProps) {
  const [status, setStatus] = useState<"idle" | "compressing" | "done" | "error">("idle");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [originalName, setOriginalName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    setError(null);
    setResultBlob(null);
    setStatus("compressing");
    setOriginalName(stripExtension(file.name));
    try {
      const result = await compressPdf(file);
      setOriginalSize(result.originalSize);
      setCompressedSize(result.compressedSize);
      setResultBlob(result.blob);
      setStatus("done");
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  }

  return (
    <div className={`cp-tool cp-pdf-compress ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

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
          accept=".pdf,application/pdf"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
        />
        {status === "compressing" ? "Compressing..." : "Drop PDF or click to browse"}
      </div>

      {status === "done" && (
        <p className="cp-stats">
          {formatBytes(originalSize)} → {formatBytes(compressedSize)} (
          {originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0}% smaller)
        </p>
      )}

      {error && <p className="cp-error" style={{ color: "#dc2626" }}>{error}</p>}

      <button
        type="button"
        className="cp-button cp-button-active"
        disabled={!resultBlob}
        onClick={() => {
          if (resultBlob) triggerDownload(resultBlob, `${originalName || "document"}-compressed.pdf`);
        }}
      >
        Download compressed PDF
      </button>
    </div>
  );
}
