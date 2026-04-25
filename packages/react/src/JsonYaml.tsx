import { useEffect, useState } from "react";
import { jsonToYaml, yamlToJson } from "@convertprivately/core/data/json-yaml";
import { AttributionBadge } from "./AttributionBadge.js";

export interface JsonYamlProps {
  hideAttribution?: boolean;
  className?: string;
}

export function JsonYaml({ hideAttribution, className }: JsonYamlProps) {
  const [mode, setMode] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");
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
        const out = mode === "json-to-yaml" ? await jsonToYaml(input) : await yamlToJson(input);
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
    <div className={`cp-tool cp-json-yaml ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />
      <div className="cp-controls">
        <button
          type="button"
          onClick={() => setMode("json-to-yaml")}
          className={`cp-button ${mode === "json-to-yaml" ? "cp-button-active" : ""}`}
        >
          JSON → YAML
        </button>
        <button
          type="button"
          onClick={() => setMode("yaml-to-json")}
          className={`cp-button ${mode === "yaml-to-json" ? "cp-button-active" : ""}`}
        >
          YAML → JSON
        </button>
      </div>
      <textarea
        className="cp-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "json-to-yaml" ? "Paste JSON" : "Paste YAML"}
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
