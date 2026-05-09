import { useState } from "react";
import { generatePasswords, getPasswordStrength } from "@convertprivately/core/text/password";
import { AttributionBadge } from "./AttributionBadge.js";

export interface PasswordGeneratorProps {
  hideAttribution?: boolean;
  className?: string;
}

const STRENGTH_LABEL: Record<string, string> = {
  "weak": "Weak",
  "fair": "Fair",
  "strong": "Strong",
  "very-strong": "Very Strong",
};

const STRENGTH_COLOR: Record<string, string> = {
  "weak": "#ef4444",
  "fair": "#f59e0b",
  "strong": "#22c55e",
  "very-strong": "#16a34a",
};

export function PasswordGenerator({ hideAttribution, className }: PasswordGeneratorProps) {
  const [length, setLength] = useState(20);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);

  function generate() {
    setPasswords(generatePasswords(count, {
      length,
      uppercase: useUpper,
      lowercase: useLower,
      digits: useDigits,
      symbols: useSymbols,
      excludeAmbiguous,
    }));
  }

  const strength = passwords[0] ? getPasswordStrength(passwords[0]) : null;

  return (
    <div className={`cp-tool cp-password ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div style={{ marginBottom: 12, fontSize: 13 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
          Length: {length}
        </label>
        <input type="range" min={8} max={128} value={length} onChange={(e) => setLength(parseInt(e.target.value))} style={{ width: "100%" }} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12, fontSize: 13 }}>
        <label><input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} />&nbsp;A-Z Uppercase</label>
        <label><input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} />&nbsp;a-z Lowercase</label>
        <label><input type="checkbox" checked={useDigits} onChange={(e) => setUseDigits(e.target.checked)} />&nbsp;0-9 Digits</label>
        <label><input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />&nbsp;!@#$ Symbols</label>
        <label><input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} />&nbsp;Exclude ambiguous (0, O, 1, l, I)</label>
      </div>

      <div style={{ marginBottom: 12, fontSize: 13 }}>
        <label>Count:&nbsp;
          <input type="range" min={1} max={20} value={count} onChange={(e) => setCount(parseInt(e.target.value))} />
          &nbsp;{count}
        </label>
      </div>

      <button type="button" className="cp-button cp-button-active" onClick={generate} style={{ marginBottom: 12 }}>
        Generate Password{count > 1 ? "s" : ""}
      </button>

      {passwords.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {passwords.map((pw, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "8px 12px" }}>
              <code style={{ fontSize: 13, wordBreak: "break-all", flex: 1 }}>{pw}</code>
              <button type="button" className="cp-button" onClick={() => navigator.clipboard.writeText(pw).catch(() => {})}>
                Copy
              </button>
            </div>
          ))}
        </div>
      )}

      {strength && (
        <div style={{ marginTop: 10, fontSize: 12 }}>
          <span style={{ color: "#6b7280" }}>Strength: </span>
          <span style={{ fontWeight: 600, color: STRENGTH_COLOR[strength] }}>{STRENGTH_LABEL[strength]}</span>
        </div>
      )}
    </div>
  );
}
