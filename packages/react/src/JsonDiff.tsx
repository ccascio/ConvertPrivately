import { useMemo, useState } from "react";
import { computeJsonDiff } from "@convertprivately/core/data/json-diff";
import { computeDiffStats } from "@convertprivately/core/text/diff";
import type { DiffLine } from "@convertprivately/core/text/diff";
import { AttributionBadge } from "./AttributionBadge.js";
import { triggerDownload } from "./utils.js";

export interface JsonDiffProps {
  hideAttribution?: boolean;
  className?: string;
}

const TYPE_STYLES: Record<string, { background: string; color: string; prefix: string }> = {
  added: { background: "#f0fdf4", color: "#166534", prefix: "+ " },
  removed: { background: "#fef2f2", color: "#991b1b", prefix: "- " },
  equal: { background: "transparent", color: "#374151", prefix: "  " },
};

export function JsonDiff({ hideAttribution, className }: JsonDiffProps) {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const lines: DiffLine[] = useMemo(
    () => (left || right ? computeJsonDiff(left, right) : []),
    [left, right],
  );
  const stats = useMemo(() => computeDiffStats(lines), [lines]);

  function patchText() {
    return lines.map((l) => TYPE_STYLES[l.type]!.prefix + l.content).join("\n");
  }

  return (
    <div className={`cp-tool cp-json-diff ${className ?? ""}`}>
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
            Original
          </label>
          <textarea
            className="cp-textarea"
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste original JSON here…"
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
            Modified
          </label>
          <textarea
            className="cp-textarea"
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste modified JSON here…"
            rows={12}
            style={{ width: "100%", fontFamily: "monospace", fontSize: 13 }}
          />
        </div>
      </div>

      {lines.length > 0 && (
        <>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
            <span style={{ color: "#166534" }}>+{stats.added} added</span>
            <span style={{ color: "#991b1b" }}>-{stats.removed} removed</span>
            <span>{stats.unchanged} unchanged</span>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              overflow: "auto",
              fontFamily: "monospace",
              fontSize: 12,
              marginBottom: 12,
            }}
          >
            {lines.map((line, i) => {
              const s = TYPE_STYLES[line.type]!;
              return (
                <div
                  key={i}
                  style={{
                    background: s.background,
                    color: s.color,
                    padding: "1px 8px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  {s.prefix}
                  {line.content}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="cp-button"
              onClick={() => navigator.clipboard.writeText(patchText()).catch(() => {})}
            >
              Copy diff
            </button>
            <button
              type="button"
              className="cp-button cp-button-active"
              onClick={() =>
                triggerDownload(new Blob([patchText()], { type: "text/plain" }), "diff.patch")
              }
            >
              Download .patch
            </button>
          </div>
        </>
      )}
    </div>
  );
}
