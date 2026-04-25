import { useMemo, useState } from "react";
import { encodeUrl, decodeUrl } from "@convertprivately/core/text/url-encode";
import { AttributionBadge } from "./AttributionBadge.js";

export interface UrlEncodeProps {
  hideAttribution?: boolean;
  className?: string;
}

export function UrlEncode({ hideAttribution, className }: UrlEncodeProps) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      return { output: mode === "encode" ? encodeUrl(input) : decodeUrl(input), error: null };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div className={`cp-tool cp-url-encode ${className ?? ""}`}>
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
        placeholder={mode === "encode" ? "Text to encode" : "URL-encoded text"}
        rows={4}
        style={{ width: "100%", fontFamily: "monospace" }}
      />
      {error && <p className="cp-error" style={{ color: "#dc2626" }}>{error}</p>}
      {output && (
        <textarea
          readOnly
          className="cp-textarea"
          value={output}
          rows={4}
          style={{ width: "100%", fontFamily: "monospace" }}
        />
      )}
    </div>
  );
}
