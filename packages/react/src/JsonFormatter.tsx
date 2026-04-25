import { useMemo, useState } from "react";
import { formatJson, minifyJson } from "@convertprivately/core/data/json-formatter";
import { AttributionBadge } from "./AttributionBadge.js";

export interface JsonFormatterProps {
  hideAttribution?: boolean;
  className?: string;
}

export function JsonFormatter({ hideAttribution, className }: JsonFormatterProps) {
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [indent, setIndent] = useState(2);
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      return { output: mode === "format" ? formatJson(input, indent) : minifyJson(input), error: null };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, mode, indent]);

  return (
    <div className={`cp-tool cp-json-formatter ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />
      <div className="cp-controls">
        <button
          type="button"
          onClick={() => setMode("format")}
          className={`cp-button ${mode === "format" ? "cp-button-active" : ""}`}
        >
          Format
        </button>
        <button
          type="button"
          onClick={() => setMode("minify")}
          className={`cp-button ${mode === "minify" ? "cp-button-active" : ""}`}
        >
          Minify
        </button>
        {mode === "format" && (
          <label style={{ fontSize: 14, marginLeft: 8 }}>
            Indent:{" "}
            <input
              type="number"
              min={0}
              max={8}
              value={indent}
              onChange={(e) => setIndent(Math.max(0, Math.min(8, Number(e.target.value) || 0)))}
              style={{ width: 50 }}
            />
          </label>
        )}
      </div>
      <textarea
        className="cp-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JSON"
        rows={8}
        style={{ width: "100%", fontFamily: "monospace" }}
      />
      {error && <p className="cp-error" style={{ color: "#dc2626" }}>{error}</p>}
      {output && (
        <textarea
          readOnly
          className="cp-textarea"
          value={output}
          rows={8}
          style={{ width: "100%", fontFamily: "monospace" }}
        />
      )}
    </div>
  );
}
