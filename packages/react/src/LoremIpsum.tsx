import { useMemo, useState } from "react";
import { generateLoremIpsum } from "@convertprivately/core/text/lorem-ipsum";
import type { LoremOutputType } from "@convertprivately/core/text/lorem-ipsum";
import { AttributionBadge } from "./AttributionBadge.js";
import { triggerDownload } from "./utils.js";

export interface LoremIpsumProps {
  hideAttribution?: boolean;
  className?: string;
}

export function LoremIpsum({ hideAttribution, className }: LoremIpsumProps) {
  const [type, setType] = useState<LoremOutputType>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [seed, setSeed] = useState(0);

  const output = useMemo(
    () => generateLoremIpsum({ type, count, startWithLorem }),
    [type, count, startWithLorem, seed],
  );

  const maxCount = type === "words" ? 500 : type === "sentences" ? 50 : 20;

  return (
    <div className={`cp-tool cp-lorem ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {(["paragraphs", "sentences", "words"] as LoremOutputType[]).map((t) => (
            <button key={t} type="button" className={`cp-button ${type === t ? "cp-button-active" : ""}`} onClick={() => setType(t)} style={{ textTransform: "capitalize" }}>
              {t}
            </button>
          ))}
        </div>

        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
          Count:&nbsp;
          <input type="number" min={1} max={maxCount} value={count} onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))} style={{ width: 64 }} />
        </label>

        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
          <input type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} />
          &nbsp;Start with "Lorem ipsum…"
        </label>

        <button type="button" className="cp-button" onClick={() => setSeed((s) => s + 1)}>
          Regenerate
        </button>
      </div>

      <textarea
        readOnly
        value={output}
        rows={10}
        style={{ width: "100%", fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.6, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "10px 14px", resize: "vertical" }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button type="button" className="cp-button" onClick={() => navigator.clipboard.writeText(output).catch(() => {})}>
          Copy Text
        </button>
        <button type="button" className="cp-button cp-button-active" onClick={() => triggerDownload(new Blob([output], { type: "text/plain" }), "lorem-ipsum.txt")}>
          Download .txt
        </button>
      </div>
    </div>
  );
}
