import { useState } from "react";
import { encodeBase64, decodeBase64 } from "@convertprivately/core/text/base64";
import { AttributionBadge } from "./AttributionBadge.js";

export interface Base64Props {
  hideAttribution?: boolean;
  className?: string;
}

export function Base64({ hideAttribution, className }: Base64Props) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleConvert() {
    setError(null);
    try {
      setOutput(mode === "encode" ? encodeBase64(input) : decodeBase64(input));
    } catch (e) {
      setError((e as Error).message || "Invalid input.");
      setOutput("");
    }
  }

  return (
    <div className={`cp-tool cp-base64 ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div className="cp-controls">
        <button
          type="button"
          onClick={() => setMode("encode")}
          className={`cp-button ${mode === "encode" ? "cp-button-active" : ""}`}
        >
          Encode
        </button>
        <button
          type="button"
          onClick={() => setMode("decode")}
          className={`cp-button ${mode === "decode" ? "cp-button-active" : ""}`}
        >
          Decode
        </button>
      </div>

      <textarea
        className="cp-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? "Text to encode" : "Base64 to decode"}
        rows={6}
        style={{ width: "100%", fontFamily: "monospace" }}
      />

      <button type="button" className="cp-button cp-button-active" onClick={handleConvert}>
        {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
      </button>

      {error && <p className="cp-error" style={{ color: "#dc2626" }}>{error}</p>}

      {output && (
        <textarea
          readOnly
          className="cp-textarea"
          value={output}
          rows={6}
          style={{ width: "100%", fontFamily: "monospace" }}
        />
      )}
    </div>
  );
}
