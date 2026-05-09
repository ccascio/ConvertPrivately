import { useRef, useState } from "react";
import { resizeImage } from "@convertprivately/core/image/resize";
import type { ResizeImageOptions } from "@convertprivately/core/image/resize";
import { AttributionBadge } from "./AttributionBadge.js";
import { triggerDownload, stripExtension } from "./utils.js";

type ResizeMode = "dimensions" | "percentage" | "maxDimension";

function fmtSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export interface ImageResizeProps {
  hideAttribution?: boolean;
  className?: string;
}

export function ImageResize({ hideAttribution, className }: ImageResizeProps) {
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [originalW, setOriginalW] = useState(0);
  const [originalH, setOriginalH] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultW, setResultW] = useState(0);
  const [resultH, setResultH] = useState(0);
  const [resultSize, setResultSize] = useState(0);
  const [mode, setMode] = useState<ResizeMode>("dimensions");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockAspect, setLockAspect] = useState(true);
  const [percentage, setPercentage] = useState("50");
  const [maxDim, setMaxDim] = useState("800");
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [quality, setQuality] = useState(92);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    setSourceUrl(url);
    setSourceFile(file);
    setResultUrl(null);
    setResultBlob(null);
    setError(null);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setOriginalW(img.naturalWidth);
      setOriginalH(img.naturalHeight);
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
    };
    img.src = url;
  }

  function handleWidthChange(v: string) {
    setWidth(v);
    if (lockAspect && imgRef.current && v) {
      setHeight(String(Math.round(Number(v) * imgRef.current.naturalHeight / imgRef.current.naturalWidth)));
    }
  }

  function handleHeightChange(v: string) {
    setHeight(v);
    if (lockAspect && imgRef.current && v) {
      setWidth(String(Math.round(Number(v) * imgRef.current.naturalWidth / imgRef.current.naturalHeight)));
    }
  }

  async function handleResize() {
    if (!sourceFile) return;
    setError(null);
    setBusy(true);
    try {
      const opts: ResizeImageOptions = { format, quality: quality / 100 };
      if (mode === "dimensions") {
        opts.width = parseInt(width) || originalW;
        opts.height = parseInt(height) || originalH;
        opts.lockAspect = false;
      } else if (mode === "percentage") {
        opts.percentage = parseFloat(percentage);
      } else {
        opts.maxDimension = parseInt(maxDim) || 800;
      }
      const result = await resizeImage(sourceFile, opts);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultBlob(result.blob);
      setResultUrl(URL.createObjectURL(result.blob));
      setResultW(result.width);
      setResultH(result.height);
      setResultSize(result.blob.size);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resize failed");
    } finally {
      setBusy(false);
    }
  }

  function handleDownload() {
    if (!resultBlob || !sourceFile) return;
    const ext = format === "image/png" ? "png" : format === "image/jpeg" ? "jpg" : "webp";
    triggerDownload(resultBlob, `${stripExtension(sourceFile.name)}-${resultW}x${resultH}.${ext}`);
  }

  return (
    <div className={`cp-tool cp-image-resize ${className ?? ""}`}>
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
          flexDirection: "column",
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

      {originalW > 0 && (
        <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
          Original: {originalW}×{originalH}px
        </p>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {(["dimensions", "percentage", "maxDimension"] as ResizeMode[]).map((m) => (
          <button key={m} type="button" className={`cp-button ${mode === m ? "cp-button-active" : ""}`} onClick={() => setMode(m)}>
            {m === "dimensions" ? "Exact Size" : m === "percentage" ? "Percentage" : "Max Dimension"}
          </button>
        ))}
      </div>

      {mode === "dimensions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>
            Width (px):&nbsp;
            <input type="number" min={1} max={16383} value={width} onChange={(e) => handleWidthChange(e.target.value)} style={{ width: 80 }} />
          </label>
          <label style={{ fontSize: 13 }}>
            Height (px):&nbsp;
            <input type="number" min={1} max={16383} value={height} onChange={(e) => handleHeightChange(e.target.value)} style={{ width: 80 }} />
          </label>
          <label style={{ fontSize: 13 }}>
            <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect(e.target.checked)} />&nbsp;Lock aspect ratio
          </label>
        </div>
      )}

      {mode === "percentage" && (
        <div style={{ marginBottom: 12, fontSize: 13 }}>
          Scale (%):&nbsp;
          <input type="number" min={1} max={500} value={percentage} onChange={(e) => setPercentage(e.target.value)} style={{ width: 80 }} />
        </div>
      )}

      {mode === "maxDimension" && (
        <div style={{ marginBottom: 12, fontSize: 13 }}>
          Max side (px):&nbsp;
          <input type="number" min={1} max={16383} value={maxDim} onChange={(e) => setMaxDim(e.target.value)} style={{ width: 80 }} />
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: "wrap", fontSize: 13 }}>
        <label>
          Format:&nbsp;
          <select value={format} onChange={(e) => setFormat(e.target.value as typeof format)}>
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
        </label>
        {format !== "image/png" && (
          <label>
            Quality: {quality}%&nbsp;
            <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
          </label>
        )}
      </div>

      {resultUrl && (
        <div style={{ marginBottom: 12 }}>
          <img src={resultUrl} alt="Resized" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", display: "block" }} />
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{resultW}×{resultH}px · {fmtSize(resultSize)}</p>
        </div>
      )}

      {error && <p className="cp-error" style={{ color: "#dc2626", marginBottom: 8 }}>{error}</p>}

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" className="cp-button cp-button-active" onClick={handleResize} disabled={!sourceFile || busy}>
          {busy ? "Resizing…" : "Resize"}
        </button>
        <button type="button" className="cp-button" onClick={handleDownload} disabled={!resultBlob}>
          Download
        </button>
      </div>
    </div>
  );
}
