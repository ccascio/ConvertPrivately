import { useState } from "react";
import { BASES, convertNumberBase } from "@convertprivately/core/text/base-convert";
import type { NumberBase } from "@convertprivately/core/text/base-convert";
import { AttributionBadge } from "./AttributionBadge.js";

export interface BaseConvertProps {
  hideAttribution?: boolean;
  className?: string;
}

const PLACEHOLDERS: Record<NumberBase, string> = { 2: "1010", 8: "12", 10: "42", 16: "2A" };

export function BaseConvert({ hideAttribution, className }: BaseConvertProps) {
  const [inputBase, setInputBase] = useState<NumberBase>(10);
  const [input, setInput] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const conversions = convertNumberBase(input, inputBase);
  const inputError =
    input.trim() && !conversions
      ? `Invalid ${BASES.find((b) => b.base === inputBase)?.label.toLowerCase()} number`
      : "";

  async function handleCopy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  return (
    <div className={`cp-tool cp-base-convert ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 600,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 6,
          }}
        >
          Input Base
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {BASES.map((b) => (
            <button
              key={b.base}
              type="button"
              className={`cp-button ${inputBase === b.base ? "cp-button-active" : ""}`}
              onClick={() => {
                setInputBase(b.base);
                setInput("");
              }}
            >
              Base {b.base} ({b.label})
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
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
          {BASES.find((b) => b.base === inputBase)?.label} Number
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={PLACEHOLDERS[inputBase]}
          style={{
            width: "100%",
            fontFamily: "monospace",
            fontSize: 14,
            padding: "8px 10px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
          }}
        />
        {inputError && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{inputError}</p>}
      </div>

      {conversions && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {conversions.map((c) => (
            <div
              key={c.base}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 6,
                background: c.base === inputBase ? "#eff6ff" : "#f9fafb",
                border: `1px solid ${c.base === inputBase ? "#bfdbfe" : "#e5e7eb"}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Base {c.base} — {c.label}
                </div>
                <code style={{ fontSize: 13, color: "#111827" }}>
                  {c.prefix}
                  <strong>{c.value}</strong>
                </code>
              </div>
              <button
                type="button"
                className="cp-button"
                onClick={() => handleCopy(String(c.base), c.prefix + c.value)}
              >
                {copiedKey === String(c.base) ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}

      {!input.trim() && (
        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, marginTop: 16 }}>
          Enter a number above to see conversions in all bases.
        </p>
      )}
    </div>
  );
}
