import { useEffect, useState } from "react";
import { jsonToXml, xmlToJson } from "@convertprivately/core/data/json-xml";
import { AttributionBadge } from "./AttributionBadge.js";

export interface JsonXmlProps {
  hideAttribution?: boolean;
  className?: string;
}

export function JsonXml({ hideAttribution, className }: JsonXmlProps) {
  const [mode, setMode] = useState<"json-to-xml" | "xml-to-json">("json-to-xml");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    (async () => {
      try {
        const out = mode === "json-to-xml" ? await jsonToXml(input) : await xmlToJson(input);
        if (!cancelled) setOutput(out);
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
          setOutput("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [input, mode]);

  return (
    <div className={`cp-tool cp-json-xml ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />
      <div className="cp-controls">
        <button
          type="button"
          onClick={() => setMode("json-to-xml")}
          className={`cp-button ${mode === "json-to-xml" ? "cp-button-active" : ""}`}
        >
          JSON → XML
        </button>
        <button
          type="button"
          onClick={() => setMode("xml-to-json")}
          className={`cp-button ${mode === "xml-to-json" ? "cp-button-active" : ""}`}
        >
          XML → JSON
        </button>
      </div>
      <textarea
        className="cp-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "json-to-xml" ? "Paste JSON" : "Paste XML"}
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
