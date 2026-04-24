import { useRef, useState } from "react";
import { heicToImage, type HeicOutputFormat } from "@convertprivately/core/image/heic";
import { AttributionBadge } from "./AttributionBadge.js";
import { triggerDownload, stripExtension } from "./utils.js";

export interface HeicConvertProps {
  hideAttribution?: boolean;
  defaultFormat?: HeicOutputFormat;
  lockedFormat?: HeicOutputFormat;
  className?: string;
}

export function HeicConvert({
  hideAttribution,
  defaultFormat = "jpeg",
  lockedFormat,
  className,
}: HeicConvertProps) {
  const [format, setFormat] = useState<HeicOutputFormat>(lockedFormat ?? defaultFormat);
  const [quality, setQuality] = useState(90);
  const [status, setStatus] = useState<"idle" | "converting" | "done" | "error">("idle");
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
    setStatus("converting");
    setOriginalName(stripExtension(file.name));
    try {
      const blob = await heicToImage(file, { format, quality: quality / 100 });
      setResultBlob(blob);
      setPreview(URL.createObjectURL(blob));
      setStatus("done");
    } catch (e) {
      setError((e as Error).message || "Conversion failed. Ensure the file is a valid HEIC/HEIF image.");
      setStatus("error");
    }
  }

  const supportsQuality = format !== "png";
  const activeFormat = lockedFormat ?? format;

  return (
    <div className={`cp-tool cp-heic-convert ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      {!lockedFormat && (
        <div className="cp-controls">
          {(["jpeg", "png", "webp"] as HeicOutputFormat[]).map((fmt) => (
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
            min={40}
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
          accept=".heic,.heif,image/heic,image/heif"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
        />
        {status === "converting" ? "Converting..." : "Drop HEIC / HEIF file or click to browse"}
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
            triggerDownload(resultBlob, `${originalName || "converted"}.${activeFormat}`);
          }
        }}
      >
        Download {activeFormat.toUpperCase()}
      </button>
    </div>
  );
}
