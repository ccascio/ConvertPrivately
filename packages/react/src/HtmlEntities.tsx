import { useMemo, useState } from "react";
import { encodeHtmlEntities, decodeHtmlEntities } from "@convertprivately/core/text/html-entities";
import { AttributionBadge } from "./AttributionBadge.js";

export interface HtmlEntitiesProps {
  hideAttribution?: boolean;
  className?: string;
}

export function HtmlEntities({ hideAttribution, className }: HtmlEntitiesProps) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input) return "";
    return mode === "encode" ? encodeHtmlEntities(input) : decodeHtmlEntities(input);
  }, [input, mode]);

  return (
    <div className={`cp-tool cp-html-entities ${className ?? ""}`}>
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
        placeholder={mode === "encode" ? "Text to encode" : "Encoded HTML"}
        rows={4}
        style={{ width: "100%", fontFamily: "monospace" }}
      />
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
