import { useRef, useState } from "react";
import { avifToImage, type AvifOutputFormat } from "@convertprivately/core/image/avif";
import { AttributionBadge } from "./AttributionBadge.js";
import { triggerDownload, stripExtension } from "./utils.js";

export interface AvifConvertProps {
  hideAttribution?: boolean;
  defaultFormat?: AvifOutputFormat;
  lockedFormat?: AvifOutputFormat;
  className?: string;
}

export function AvifConvert({
  hideAttribution,
  defaultFormat = "jpeg",
  lockedFormat,
  className,
}: AvifConvertProps) {
  const [format, setFormat] = useState<AvifOutputFormat>(lockedFormat ?? defaultFormat);
  const [quality, setQuality] = useState(92);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [originalName, setOriginalName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "converting" | "done" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFormat = lockedFormat ?? format;
  const supportsQuality = activeFormat !== "png";

  async function processFile(file: File) {
    setError(null);
    setResultBlob(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setStatus("converting");
    setOriginalName(stripExtension(file.name));
    try {
      const blob = await avifToImage(file, { format: activeFormat, quality: quality / 100 });
      setResultBlob(blob);
      setPreview(URL.createObjectURL(blob));
      setStatus("done");
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  }

  return (
    <div className={`cp-tool cp-avif-convert ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      {!lockedFormat && (
        <div className="cp-controls">
          {(["jpeg", "png", "webp"] as AvifOutputFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormat(fmt)}
              className={`cp-button ${format === fmt ? "cp-button-active" : ""}`}
            >
              → {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {supportsQuality && (
        <label className="cp-quality">
          Quality: {quality}%
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
          />
        </label>
      )}

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
          accept=".avif,image/avif"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
        />
        {status === "converting" ? "Converting..." : "Drop AVIF image or click to browse"}
      </div>

      {preview && (
        <div className="cp-preview">
          <img src={preview} alt="Converted preview" style={{ maxWidth: "100%" }} />
        </div>
      )}

      {error && <p className="cp-error" style={{ color: "#dc2626" }}>{error}</p>}

      <button
        type="button"
        className="cp-button cp-download"
        disabled={!resultBlob}
        onClick={() => {
          if (resultBlob) {
            const ext = activeFormat === "jpeg" ? "jpg" : activeFormat;
            triggerDownload(resultBlob, `${originalName || "converted"}.${ext}`);
          }
        }}
      >
        Download {activeFormat.toUpperCase()}
      </button>
    </div>
  );
}
