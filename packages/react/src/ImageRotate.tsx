import { useRef, useState } from "react";
import { rotateImage } from "@convertprivately/core/image/rotate";
import type { RotationAngle, FlipAxis } from "@convertprivately/core/image/rotate";
import { AttributionBadge } from "./AttributionBadge.js";
import { triggerDownload, stripExtension } from "./utils.js";

export interface ImageRotateProps {
  hideAttribution?: boolean;
  className?: string;
}

export function ImageRotate({ hideAttribution, className }: ImageRotateProps) {
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [rotation, setRotation] = useState<RotationAngle>(0);
  const [flip, setFlip] = useState<FlipAxis>("none");
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setSourceUrl(URL.createObjectURL(file));
    setSourceFile(file);
    setResultUrl(null);
    setResultBlob(null);
    setError(null);
  }

  async function handleApply() {
    if (!sourceFile) return;
    setError(null);
    setBusy(true);
    try {
      const blob = await rotateImage(sourceFile, { rotation, flip, format });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transform failed");
    } finally {
      setBusy(false);
    }
  }

  function handleDownload() {
    if (!resultBlob || !sourceFile) return;
    const ext = format === "image/png" ? "png" : format === "image/jpeg" ? "jpg" : "webp";
    const suffix = rotation !== 0 ? `-rot${rotation}` : "";
    const flipSuffix = flip !== "none" ? `-flip-${flip}` : "";
    triggerDownload(resultBlob, `${stripExtension(sourceFile.name)}${suffix}${flipSuffix}.${ext}`);
  }

  return (
    <div className={`cp-tool cp-image-rotate ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? "#3b82f6" : "#d1d5db"}`,
          borderRadius: 8,
          padding: 24,
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 12,
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        {sourceUrl
          ? <img src={sourceUrl} alt="Source" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain" }} />
          : <span style={{ color: "#9ca3af" }}>Drop an image here or click to browse</span>
        }
      </div>

      <div style={{ marginBottom: 10, fontSize: 13 }}>
        <strong>Rotate:</strong>&nbsp;
        {([0, 90, 180, 270] as RotationAngle[]).map((a) => (
          <button key={a} type="button" className={`cp-button ${rotation === a ? "cp-button-active" : ""}`} onClick={() => setRotation(a)} style={{ marginRight: 4 }}>
            {a === 0 ? "None" : `${a}°`}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 10, fontSize: 13 }}>
        <strong>Flip:</strong>&nbsp;
        {(["none", "horizontal", "vertical", "both"] as FlipAxis[]).map((f) => (
          <button key={f} type="button" className={`cp-button ${flip === f ? "cp-button-active" : ""}`} onClick={() => setFlip(f)} style={{ marginRight: 4 }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12, fontSize: 13 }}>
        <label>
          Format:&nbsp;
          <select value={format} onChange={(e) => setFormat(e.target.value as typeof format)}>
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
        </label>
      </div>

      {resultUrl && (
        <div style={{ marginBottom: 12 }}>
          <img src={resultUrl} alt="Result" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", display: "block" }} />
        </div>
      )}

      {error && <p className="cp-error" style={{ color: "#dc2626", marginBottom: 8 }}>{error}</p>}

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" className="cp-button cp-button-active" onClick={handleApply} disabled={!sourceFile || busy}>
          {busy ? "Applying…" : "Apply"}
        </button>
        <button type="button" className="cp-button" onClick={handleDownload} disabled={!resultBlob}>
          Download
        </button>
      </div>
    </div>
  );
}
