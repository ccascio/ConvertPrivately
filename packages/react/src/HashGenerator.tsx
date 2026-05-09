import { useEffect, useState } from "react";
import { hashAll, HASH_ALGORITHMS } from "@convertprivately/core/text/hash";
import type { HashAlgorithm } from "@convertprivately/core/text/hash";
import { AttributionBadge } from "./AttributionBadge.js";

export interface HashGeneratorProps {
  hideAttribution?: boolean;
  className?: string;
}

export function HashGenerator({ hideAttribution, className }: HashGeneratorProps) {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Partial<Record<HashAlgorithm, string>>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!input) { setHashes({}); return; }
    let cancelled = false;
    hashAll(input).then((result) => {
      if (!cancelled) setHashes(result);
    });
    return () => { cancelled = true; };
  }, [input]);

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
    <div className={`cp-tool cp-hash ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <textarea
        className="cp-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to hash…"
        rows={5}
        style={{ width: "100%", fontFamily: "monospace" }}
      />

      {Object.keys(hashes).length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {HASH_ALGORITHMS.map((algo) => (
            <div key={algo} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "8px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{algo}</span>
                <button type="button" className="cp-button" onClick={() => handleCopy(algo, hashes[algo] ?? "")} disabled={!hashes[algo]}>
                  {copiedKey === algo ? "Copied!" : "Copy"}
                </button>
              </div>
              <code style={{ fontSize: 12, wordBreak: "break-all", display: "block", color: "#111827" }}>
                {hashes[algo] ?? "Computing…"}
              </code>
            </div>
          ))}
        </div>
      )}

      {!input && (
        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, marginTop: 16 }}>
          Enter text above to generate hashes.
        </p>
      )}
    </div>
  );
}
