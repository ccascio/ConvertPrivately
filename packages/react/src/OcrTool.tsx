import { useRef, useState } from "react";
import { recognizeText } from "@convertprivately/core/ocr";
import { AttributionBadge } from "./AttributionBadge.js";

export interface OcrToolProps {
  hideAttribution?: boolean;
  defaultLanguage?: string;
  className?: string;
}

export function OcrTool({
  hideAttribution,
  defaultLanguage = "eng",
  className,
}: OcrToolProps) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    setError(null);
    setResult("");
    setProgress(0);
    setRunning(true);
    try {
      const text = await recognizeText(file, {
        language,
        onProgress: (p) => {
          setProgress(p.progress);
          setStatus(p.status);
        },
      });
      setResult(text);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className={`cp-tool cp-ocr ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div className="cp-controls">
        <label>
          Language:
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="eng">English</option>
            <option value="ita">Italian</option>
            <option value="fra">French</option>
            <option value="deu">German</option>
            <option value="spa">Spanish</option>
            <option value="por">Portuguese</option>
            <option value="nld">Dutch</option>
            <option value="chi_sim">Chinese (Simplified)</option>
            <option value="jpn">Japanese</option>
          </select>
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
        {running ? `${status} (${Math.round(progress * 100)}%)` : "Drop image or click to browse"}
      </div>

      {error && <p className="cp-error" style={{ color: "#dc2626" }}>{error}</p>}

      {result && (
        <textarea
          readOnly
          className="cp-textarea"
          value={result}
          rows={10}
          style={{ width: "100%", fontFamily: "monospace" }}
        />
      )}
    </div>
  );
}
