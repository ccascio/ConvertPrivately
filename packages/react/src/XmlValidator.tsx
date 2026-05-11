import { useMemo, useState } from "react";
import { validateXml } from "@convertprivately/core/data/xml-validate";
import { AttributionBadge } from "./AttributionBadge.js";

export interface XmlValidatorProps {
  hideAttribution?: boolean;
  className?: string;
  defaultText?: string;
}

export function XmlValidator({ hideAttribution, className, defaultText = "" }: XmlValidatorProps) {
  const [input, setInput] = useState(defaultText);
  const result = useMemo(() => (input.trim() ? validateXml(input) : null), [input]);

  return (
    <div className={`cp-tool cp-xml-validator ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <textarea
        className="cp-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste XML here…"
        rows={10}
        style={{ width: "100%", fontFamily: "monospace", fontSize: 13, marginBottom: 12 }}
      />

      {result && (
        <>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              marginBottom: 10,
              background: result.isValid ? "#f0fdf4" : "#fef2f2",
              color: result.isValid ? "#166534" : "#991b1b",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {result.isValid ? "✓ Well-formed XML" : "✗ Invalid XML"}
          </div>

          {Object.keys(result.stats).length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 8,
                marginBottom: 12,
              }}
            >
              {Object.entries(result.stats).map(([label, value]) => (
                <div
                  key={label}
                  style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "8px 10px" }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{value}</div>
                </div>
              ))}
            </div>
          )}

          {result.issues.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {result.issues.map((issue, i) => (
                <div
                  key={i}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 4,
                    fontSize: 12,
                    background: issue.severity === "error" ? "#fef2f2" : "#fefce8",
                    color: issue.severity === "error" ? "#991b1b" : "#854d0e",
                  }}
                >
                  {issue.row !== null ? `Line ${issue.row}: ` : ""}
                  {issue.message}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
