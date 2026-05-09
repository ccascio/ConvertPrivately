import { useState } from "react";
import { textToAscii, textToBinary, textToHex, fromEncoded } from "@convertprivately/core/text/ascii-convert";
import { AttributionBadge } from "./AttributionBadge.js";

type Mode = "to-ascii" | "to-binary" | "to-hex" | "from";

const MODES: { value: Mode; label: string }[] = [
  { value: "to-ascii", label: "Text → ASCII" },
  { value: "to-binary", label: "Text → Binary" },
  { value: "to-hex", label: "Text → Hex" },
  { value: "from", label: "Decode" },
];

const SAMPLES: Record<Mode, string> = {
  "to-ascii": "Hello, World!",
  "to-binary": "Hello, World!",
  "to-hex": "Hello, World!",
  "from": "72 101 108 108 111 44 32 87 111 114 108 100 33",
};

export interface AsciiConvertProps {
  hideAttribution?: boolean;
  className?: string;
}

export function AsciiConvert({ hideAttribution, className }: AsciiConvertProps) {
  const [mode, setMode] = useState<Mode>("to-ascii");
  const [input, setInput] = useState(SAMPLES["to-ascii"]);

  function getOutput(): string {
    if (!input) return "";
    if (mode === "to-ascii") return textToAscii(input);
    if (mode === "to-binary") return textToBinary(input);
    if (mode === "to-hex") return textToHex(input);
    return fromEncoded(input);
  }

  const output = getOutput();

  return (
    <div className={`cp-tool cp-ascii ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {MODES.map((m) => (
          <button key={m.value} type="button" className={`cp-button ${mode === m.value ? "cp-button-active" : ""}`} onClick={() => { setMode(m.value); setInput(SAMPLES[m.value]); }}>
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {mode === "from" ? "Encoded Input" : "Text Input"}
          </label>
          <textarea
            className="cp-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            style={{ width: "100%", fontFamily: "monospace", fontSize: 13 }}
          />
          {mode === "from" && (
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
              Auto-detects binary (8-bit), hex, or decimal ASCII
            </p>
          )}
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Output</label>
          <textarea
            className="cp-textarea"
            value={output}
            readOnly
            rows={10}
            placeholder="Output will appear here…"
            style={{ width: "100%", fontFamily: "monospace", fontSize: 13 }}
          />
        </div>
      </div>

      <button type="button" className="cp-button" onClick={() => output && navigator.clipboard.writeText(output).catch(() => {})} disabled={!output}>
        Copy
      </button>
    </div>
  );
}
