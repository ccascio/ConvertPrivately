import { useMemo, useState } from "react";
import { testRegex, buildFlagString } from "@convertprivately/core/text/regex";
import { AttributionBadge } from "./AttributionBadge.js";

export interface RegexTesterProps {
  hideAttribution?: boolean;
  className?: string;
}

const FLAG_LABELS: Record<string, string> = {
  g: "global",
  i: "case insensitive",
  m: "multiline",
  s: "dot-all",
};

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function RegexTester({ hideAttribution, className }: RegexTesterProps) {
  const [pattern, setPattern] = useState("\\b\\w{5}\\b");
  const [testString, setTestString] = useState("Hello world, this is a regex test. Every word here.");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });

  const flagStr = buildFlagString(flags);
  const result = useMemo(() => testRegex(pattern, testString, flags), [pattern, testString, flagStr]);

  const highlighted = useMemo(() => {
    if (result.matches.length === 0) return escapeHtml(testString);
    let out = "";
    let last = 0;
    for (const m of result.matches) {
      out += escapeHtml(testString.slice(last, m.index));
      out += `<mark style="background:#fef08a;border-radius:2px;padding:0 1px">${escapeHtml(m.value)}</mark>`;
      last = m.index + m.value.length;
    }
    out += escapeHtml(testString.slice(last));
    return out;
  }, [result.matches, testString]);

  return (
    <div className={`cp-tool cp-regex ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div style={{ marginBottom: 10 }}>
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
          Pattern
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "monospace", color: "#9ca3af", fontSize: 16 }}>/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="pattern"
            style={{
              flex: 1,
              fontFamily: "monospace",
              fontSize: 13,
              padding: "8px 10px",
              border: "1px solid #d1d5db",
              borderRadius: 6,
            }}
          />
          <span style={{ fontFamily: "monospace", color: "#9ca3af", fontSize: 16 }}>/</span>
          <span style={{ fontFamily: "monospace", color: "#2563eb", fontSize: 14, minWidth: 30 }}>{flagStr}</span>
        </div>
        {result.error && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{result.error}</p>}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 10, fontSize: 13 }}>
        {(Object.keys(flags) as (keyof typeof flags)[]).map((flag) => (
          <label key={flag} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              type="checkbox"
              checked={flags[flag]}
              onChange={(e) => setFlags((f) => ({ ...f, [flag]: e.target.checked }))}
            />
            <code style={{ fontFamily: "monospace" }}>{flag}</code>
            <span style={{ color: "#9ca3af", fontSize: 11 }}>{FLAG_LABELS[flag]}</span>
          </label>
        ))}
      </div>

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
        Test String
      </label>
      <textarea
        value={testString}
        onChange={(e) => setTestString(e.target.value)}
        rows={5}
        style={{
          width: "100%",
          fontFamily: "monospace",
          fontSize: 13,
          padding: "8px 10px",
          border: "1px solid #d1d5db",
          borderRadius: 6,
          marginBottom: 10,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Matches
        </span>
        {!result.error && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "1px 8px",
              borderRadius: 999,
              background: result.matches.length > 0 ? "#dcfce7" : "#f3f4f6",
              color: result.matches.length > 0 ? "#166534" : "#6b7280",
            }}
          >
            {result.matches.length} match{result.matches.length !== 1 ? "es" : ""}
          </span>
        )}
      </div>

      <div
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 6,
          padding: "10px 12px",
          fontFamily: "monospace",
          fontSize: 13,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          minHeight: 60,
          marginBottom: 10,
        }}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />

      {result.matches.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflowY: "auto" }}>
          {result.matches.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "6px 10px",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                fontSize: 12,
              }}
            >
              <span style={{ color: "#2563eb", fontWeight: 700, marginRight: 6 }}>#{i + 1}</span>
              <code style={{ color: "#111827" }}>{JSON.stringify(m.value)}</code>
              <span style={{ color: "#9ca3af", marginLeft: 6 }}>at index {m.index}</span>
              {m.groups.length > 0 && (
                <div style={{ marginTop: 2, color: "#6b7280" }}>
                  Groups:{" "}
                  {m.groups.map((g, gi) => (
                    <code
                      key={gi}
                      style={{
                        marginLeft: 4,
                        padding: "0 4px",
                        background: "#fef9c3",
                        borderRadius: 3,
                      }}
                    >
                      {g ?? "undefined"}
                    </code>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
