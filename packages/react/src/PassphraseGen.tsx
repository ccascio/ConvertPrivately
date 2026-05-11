import { useState } from "react";
import {
  generatePassphrases,
  estimatePassphraseEntropy,
} from "@convertprivately/core/text/passphrase";
import { AttributionBadge } from "./AttributionBadge.js";

export interface PassphraseGenProps {
  hideAttribution?: boolean;
  className?: string;
}

const SEPARATORS = [
  { label: "Hyphen", value: "-" },
  { label: "Space", value: " " },
  { label: "Period", value: "." },
  { label: "Underscore", value: "_" },
];

function strengthLabel(entropy: number): string {
  if (entropy >= 80) return "Very Strong";
  if (entropy >= 60) return "Strong";
  if (entropy >= 40) return "Fair";
  return "Weak";
}

function strengthColor(entropy: number): string {
  if (entropy >= 80) return "#16a34a";
  if (entropy >= 60) return "#22c55e";
  if (entropy >= 40) return "#f59e0b";
  return "#ef4444";
}

export function PassphraseGen({ hideAttribution, className }: PassphraseGenProps) {
  const [wordCount, setWordCount] = useState(6);
  const [separator, setSeparator] = useState("-");
  const [capitalize, setCapitalize] = useState(false);
  const [count, setCount] = useState(1);
  const [passphrases, setPassphrases] = useState<string[]>([]);

  const entropy = estimatePassphraseEntropy(wordCount);

  function generate() {
    setPassphrases(generatePassphrases(count, { wordCount, separator, capitalize }));
  }

  return (
    <div className={`cp-tool cp-passphrase ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Words: {wordCount}
          </label>
          <input
            type="range"
            min={3}
            max={12}
            value={wordCount}
            onChange={(e) => setWordCount(parseInt(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Count: {count}
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

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
          Separator
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {SEPARATORS.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`cp-button ${separator === s.value ? "cp-button-active" : ""}`}
              onClick={() => setSeparator(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <label style={{ display: "block", fontSize: 13, marginBottom: 10 }}>
        <input
          type="checkbox"
          checked={capitalize}
          onChange={(e) => setCapitalize(e.target.checked)}
        />
        &nbsp;Capitalize words
      </label>

      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>
        Entropy: ~{entropy} bits&nbsp;
        <span style={{ color: strengthColor(entropy), fontWeight: 600 }}>{strengthLabel(entropy)}</span>
      </div>

      <button type="button" className="cp-button cp-button-active" onClick={generate} style={{ marginBottom: 12 }}>
        Generate Passphrase{count > 1 ? "s" : ""}
      </button>

      {passphrases.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {passphrases.map((pw, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                padding: "8px 12px",
              }}
            >
              <code style={{ fontSize: 13, wordBreak: "break-all", flex: 1 }}>{pw}</code>
              <button
                type="button"
                className="cp-button"
                onClick={() => navigator.clipboard.writeText(pw).catch(() => {})}
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
