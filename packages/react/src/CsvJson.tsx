import { useState } from "react";
import { csvToJson, jsonToCsv } from "@convertprivately/core/text/csv-json";
import { AttributionBadge } from "./AttributionBadge.js";

export interface CsvJsonProps {
  hideAttribution?: boolean;
  className?: string;
}

type Direction = "csv-to-json" | "json-to-csv";

export function CsvJson({ hideAttribution, className }: CsvJsonProps) {
  const [direction, setDirection] = useState<Direction>("csv-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleConvert() {
    setError(null);
    try {
      if (direction === "csv-to-json") {
        const result = await csvToJson(input);
        setOutput(JSON.stringify(result, null, 2));
      } else {
        const result = await jsonToCsv(input);
        setOutput(result);
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }

  return (
    <div className={`cp-tool cp-csv-json ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div className="cp-controls">
        <button
          type="button"
          className={`cp-button ${direction === "csv-to-json" ? "cp-button-active" : ""}`}
          onClick={() => setDirection("csv-to-json")}
        >
          CSV → JSON
        </button>
        <button
          type="button"
          className={`cp-button ${direction === "json-to-csv" ? "cp-button-active" : ""}`}
          onClick={() => setDirection("json-to-csv")}
        >
          JSON → CSV
        </button>
      </div>

      <textarea
        className="cp-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={direction === "csv-to-json" ? "name,age\nAda,36" : '[{"name":"Ada","age":36}]'}
        rows={8}
        style={{ width: "100%", fontFamily: "monospace" }}
      />

      <button type="button" className="cp-button cp-button-active" onClick={handleConvert}>
        Convert
      </button>

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
