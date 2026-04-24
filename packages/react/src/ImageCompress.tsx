import { useRef, useState } from "react";
import { compressImage } from "@convertprivately/core/image/compress";
import { AttributionBadge } from "./AttributionBadge.js";
import { triggerDownload, stripExtension } from "./utils.js";

export interface ImageCompressProps {
  hideAttribution?: boolean;
  defaultMaxSizeMB?: number;
  defaultMaxWidthOrHeight?: number;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function ImageCompress({
  hideAttribution,
  defaultMaxSizeMB = 1,
  defaultMaxWidthOrHeight = 1920,
  className,
}: ImageCompressProps) {
  const [maxSizeMB, setMaxSizeMB] = useState(defaultMaxSizeMB);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(defaultMaxWidthOrHeight);
  const [status, setStatus] = useState<"idle" | "compressing" | "done" | "error">("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [originalName, setOriginalName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    setError(null);
    setResultBlob(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setStatus("compressing");
    setOriginalName(stripExtension(file.name));
    try {
      const { blob, originalSize: orig, compressedSize: compr } = await compressImage(file, {
        maxSizeMB,
        maxWidthOrHeight,
      });
      setOriginalSize(orig);
      setCompressedSize(compr);
      setResultBlob(blob);
      setPreview(URL.createObjectURL(blob));
      setStatus("done");
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  }

  return (
    <div className={`cp-tool cp-image-compress ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div className="cp-controls">
        <label>
          Max size (MB):
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={maxSizeMB}
            onChange={(e) => setMaxSizeMB(parseFloat(e.target.value) || 1)}
          />
        </label>
        <label>
          Max dimension (px):
          <input
            type="number"
            min={100}
            step={100}
            value={maxWidthOrHeight}
            onChange={(e) => setMaxWidthOrHeight(parseInt(e.target.value, 10) || 1920)}
          />
        </label>
      </div>

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
        {status === "compressing" ? "Compressing..." : "Drop image or click to browse"}
      </div>

      {preview && (
        <div className="cp-preview">
          <img src={preview} alt="Compressed preview" style={{ maxWidth: "100%" }} />
          <p className="cp-stats">
            {formatBytes(originalSize)} → {formatBytes(compressedSize)} (
            {originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0}% smaller)
          </p>
        </div>
      )}

      {error && <p className="cp-error" style={{ color: "#dc2626" }}>{error}</p>}

      <button
        type="button"
        className="cp-button cp-download"
        disabled={!resultBlob}
        onClick={() => {
          if (resultBlob) triggerDownload(resultBlob, `${originalName || "compressed"}.jpg`);
        }}
      >
        Download
      </button>
    </div>
  );
}
