import { useState } from "react";
import { generateUuid, generateUlid, generateUuids, generateUlids } from "@convertprivately/core/text/uuid";
import { AttributionBadge } from "./AttributionBadge.js";

type IdFormat = "uuid" | "ulid";

export interface UuidGeneratorProps {
  hideAttribution?: boolean;
  className?: string;
}

export function UuidGenerator({ hideAttribution, className }: UuidGeneratorProps) {
  const [format, setFormat] = useState<IdFormat>("uuid");
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [single, setSingle] = useState(() => generateUuid());
  const [batchCount, setBatchCount] = useState(5);
  const [batch, setBatch] = useState<string[]>([]);
  const [copiedSingle, setCopiedSingle] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  async function generate() {
    if (format === "ulid") {
      const id = await generateUlid({ uppercase });
      setSingle(id);
    } else {
      setSingle(generateUuid({ uppercase, hyphens }));
    }
  }

  async function generateBatchIds() {
    if (format === "ulid") {
      const ids = await generateUlids(batchCount, { uppercase });
      setBatch(ids);
    } else {
      setBatch(generateUuids(batchCount, { uppercase, hyphens }));
    }
  }

  async function copy(text: string, done: () => void) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    done();
  }

  function switchFormat(f: IdFormat) {
    setFormat(f);
    setBatch([]);
    if (f === "ulid") {
      generateUlid({ uppercase }).then(setSingle);
    } else {
      setSingle(generateUuid({ uppercase, hyphens }));
    }
  }

  return (
    <div className={`cp-tool cp-uuid ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {(["uuid", "ulid"] as IdFormat[]).map((f) => (
          <button key={f} type="button" className={`cp-button ${format === f ? "cp-button-active" : ""}`} onClick={() => switchFormat(f)}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 13, flexWrap: "wrap" }}>
        <label><input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />&nbsp;Uppercase</label>
        {format === "uuid" && (
          <label><input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} />&nbsp;With hyphens</label>
        )}
      </div>

      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "10px 14px", marginBottom: 8 }}>
        <code style={{ fontSize: 15, wordBreak: "break-all" }}>{single}</code>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button type="button" className="cp-button cp-button-active" onClick={generate}>Generate New</button>
        <button type="button" className="cp-button" onClick={() => copy(single, () => { setCopiedSingle(true); setTimeout(() => setCopiedSingle(false), 2000); })}>
          {copiedSingle ? "Copied!" : "Copy"}
        </button>
      </div>

      <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap", fontSize: 13 }}>
          <label>Count:&nbsp;
            <input type="number" min={1} max={20} value={batchCount} onChange={(e) => setBatchCount(Math.max(1, Math.min(20, Number(e.target.value))))} style={{ width: 60 }} />
          </label>
          <button type="button" className="cp-button cp-button-active" onClick={generateBatchIds}>
            Generate {batchCount}
          </button>
          {batch.length > 0 && (
            <button type="button" className="cp-button" onClick={() => copy(batch.join("\n"), () => { setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2000); })}>
              {copiedAll ? "Copied All!" : "Copy All"}
            </button>
          )}
        </div>

        {batch.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {batch.map((id, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 10px" }}>
                <code style={{ fontSize: 13, wordBreak: "break-all" }}>{id}</code>
                <button type="button" className="cp-button" onClick={() => copy(id, () => { setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 2000); })}>
                  {copiedIdx === i ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
