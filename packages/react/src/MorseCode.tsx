import { useState } from "react";
import { textToMorse, morseToText, MORSE_TABLE } from "@convertprivately/core/text/morse-code";
import { AttributionBadge } from "./AttributionBadge.js";

type Direction = "to-morse" | "from-morse";

export interface MorseCodeProps {
  hideAttribution?: boolean;
  className?: string;
}

export function MorseCode({ hideAttribution, className }: MorseCodeProps) {
  const [direction, setDirection] = useState<Direction>("to-morse");
  const [input, setInput] = useState("");

  const output = input
    ? direction === "to-morse" ? textToMorse(input) : morseToText(input)
    : "";

  function handleCopy() {
    if (output) navigator.clipboard.writeText(output).catch(() => {});
  }

  return (
    <div className={`cp-tool cp-morse ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {([["to-morse", "Text → Morse"], ["from-morse", "Morse → Text"]] as [Direction, string][]).map(([d, label]) => (
          <button key={d} type="button" className={`cp-button ${direction === d ? "cp-button-active" : ""}`} onClick={() => { setDirection(d); setInput(""); }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {direction === "to-morse" ? "Text Input" : "Morse Code Input"}
          </label>
          <textarea
            className="cp-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder={direction === "to-morse" ? "Hello World" : ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."}
            style={{ width: "100%", fontFamily: "monospace", fontSize: 13 }}
          />
          {direction === "from-morse" && (
            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Spaces between letters, <code>/</code> between words</p>
          )}
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {direction === "to-morse" ? "Morse Code Output" : "Decoded Text"}
          </label>
          <textarea
            className="cp-textarea"
            value={output}
            readOnly
            rows={8}
            placeholder="Output will appear here…"
            style={{ width: "100%", fontFamily: "monospace", fontSize: 13 }}
          />
        </div>
      </div>

      <button type="button" className="cp-button" onClick={handleCopy} disabled={!output} style={{ marginBottom: 16 }}>
        Copy
      </button>

      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8 }}>Morse Code Reference</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))", gap: 4 }}>
          {Object.entries(MORSE_TABLE)
            .filter(([k]) => k !== " ")
            .map(([char, code]) => (
              <div key={char} style={{ textAlign: "center", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 4, padding: "4px 2px" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{char}</div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#3b82f6" }}>{code}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
