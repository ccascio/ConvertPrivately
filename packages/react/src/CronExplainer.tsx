import { useEffect, useState } from "react";
import {
  explainCron,
  CRON_FIELD_NAMES,
  CRON_FIELD_RANGES,
  CRON_EXAMPLES,
} from "@convertprivately/core/text/cron";
import type { CronExplanation } from "@convertprivately/core/text/cron";
import { AttributionBadge } from "./AttributionBadge.js";

export interface CronExplainerProps {
  hideAttribution?: boolean;
  className?: string;
}

export function CronExplainer({ hideAttribution, className }: CronExplainerProps) {
  const [cronExpr, setCronExpr] = useState("0 9 * * 1-5");
  const [result, setResult] = useState<CronExplanation>({ description: "", error: null, fields: null });

  useEffect(() => {
    let cancelled = false;
    explainCron(cronExpr).then((r) => {
      if (!cancelled) setResult(r);
    });
    return () => {
      cancelled = true;
    };
  }, [cronExpr]);

  return (
    <div className={`cp-tool cp-cron ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 4,
        }}
      >
        Cron Expression
      </label>
      <input
        type="text"
        value={cronExpr}
        onChange={(e) => setCronExpr(e.target.value)}
        placeholder="* * * * *"
        spellCheck={false}
        style={{
          width: "100%",
          fontFamily: "monospace",
          fontSize: 14,
          padding: "10px 12px",
          border: "1px solid #d1d5db",
          borderRadius: 6,
          marginBottom: 8,
        }}
      />

      {result.error && <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 8 }}>{result.error}</p>}

      {result.description && (
        <div
          style={{
            padding: "10px 14px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 6,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#1d4ed8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 2,
            }}
          >
            Human Readable
          </div>
          <p style={{ color: "#1e3a8a", fontWeight: 500, margin: 0 }}>{result.description}</p>
        </div>
      )}

      {result.fields && (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 6,
            }}
          >
            Field Breakdown
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {CRON_FIELD_NAMES.map((name, i) => (
              <div key={name} style={{ textAlign: "center" }}>
                <div
                  style={{
                    background: "#f3f4f6",
                    borderRadius: 6,
                    padding: "10px 4px",
                    marginBottom: 4,
                    fontFamily: "monospace",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {result.fields![i] || "?"}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>{name}</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>{CRON_FIELD_RANGES[i]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 10 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 6,
          }}
        >
          Common Examples
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {CRON_EXAMPLES.map((ex) => (
            <button
              key={ex.expr}
              type="button"
              onClick={() => setCronExpr(ex.expr)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                background: "white",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <code style={{ fontFamily: "monospace", fontSize: 13, color: "#111827" }}>{ex.expr}</code>
              <span style={{ fontSize: 12, color: "#6b7280" }}>{ex.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
