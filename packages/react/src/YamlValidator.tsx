import { useEffect, useState } from "react";
import { validateYaml } from "@convertprivately/core/data/yaml-validate";
import type { ValidationResult } from "@convertprivately/core/data/json-validate";
import { AttributionBadge } from "./AttributionBadge.js";

export interface YamlValidatorProps {
  hideAttribution?: boolean;
  className?: string;
  defaultText?: string;
}

export function YamlValidator({ hideAttribution, className, defaultText = "" }: YamlValidatorProps) {
  const [input, setInput] = useState(defaultText);
  const [result, setResult] = useState<ValidationResult | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    let cancelled = false;
    validateYaml(input).then((r) => {
      if (!cancelled) setResult(r);
    });
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <div className={`cp-tool cp-yaml-validator ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <textarea
        className="cp-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste YAML here…"
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
            {result.isValid ? "✓ Valid YAML" : "✗ Invalid YAML"}
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
