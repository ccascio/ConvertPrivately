import { useEffect, useState } from "react";
import { jsonToCsv } from "@convertprivately/core/text/csv-json";
import { AttributionBadge } from "./AttributionBadge.js";
import { triggerDownload } from "./utils.js";

export interface JsonToCsvProps {
  hideAttribution?: boolean;
  className?: string;
  defaultText?: string;
}

const PLACEHOLDER = `[
  { "name": "Alice", "age": 30, "city": "New York" },
  { "name": "Bob", "age": 25, "city": "London" },
  { "name": "Carol", "age": 35, "city": "Paris" }
]`;

export function JsonToCsv({ hideAttribution, className, defaultText = PLACEHOLDER }: JsonToCsvProps) {
  const [input, setInput] = useState(defaultText);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const csv = await jsonToCsv(input);
        if (!cancelled) {
          setOutput(csv);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setOutput("");
          setError(e instanceof Error ? e.message : "Conversion failed");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <div className={`cp-tool cp-json-to-csv ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            JSON Input
          </label>
          <textarea
            className="cp-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a JSON array of objects here…"
            rows={12}
            style={{ width: "100%", fontFamily: "monospace", fontSize: 13 }}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            CSV Output
          </label>
          <textarea
            readOnly
            value={error ? "" : output}
            placeholder="CSV output will appear here…"
            rows={12}
            style={{
              width: "100%",
              fontFamily: "monospace",
              fontSize: 13,
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              padding: "8px 10px",
            }}
          />
          {error && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>Error: {error}</p>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          className="cp-button"
          onClick={() => output && navigator.clipboard.writeText(output).catch(() => {})}
          disabled={!output}
        >
          Copy CSV
        </button>
        <button
          type="button"
          className="cp-button cp-button-active"
          onClick={() =>
            output &&
            triggerDownload(new Blob([output], { type: "text/csv" }), "converted.csv")
          }
          disabled={!output}
        >
          Download .csv
        </button>
      </div>
    </div>
  );
}
