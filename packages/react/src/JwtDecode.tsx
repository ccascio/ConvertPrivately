import { useMemo, useState } from "react";
import { decodeJwt } from "@convertprivately/core/text/jwt-decode";
import { AttributionBadge } from "./AttributionBadge.js";

export interface JwtDecodeProps {
  hideAttribution?: boolean;
  className?: string;
}

export function JwtDecode({ hideAttribution, className }: JwtDecodeProps) {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return { ok: true as const, parts: decodeJwt(input) };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  }, [input]);

  return (
    <div className={`cp-tool cp-jwt ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />
      <textarea
        className="cp-textarea"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste JWT (header.payload.signature)"
        rows={4}
        style={{ width: "100%", fontFamily: "monospace" }}
      />
      {result && !result.ok && (
        <p className="cp-error" style={{ color: "#dc2626" }}>{result.error}</p>
      )}
      {result && result.ok && (
        <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600 }}>Header</p>
            <pre style={{ background: "#f3f4f6", padding: 8, fontSize: 13, overflow: "auto" }}>
              {JSON.stringify(result.parts.header, null, 2)}
            </pre>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600 }}>Payload</p>
            <pre style={{ background: "#f3f4f6", padding: 8, fontSize: 13, overflow: "auto" }}>
              {JSON.stringify(result.parts.payload, null, 2)}
            </pre>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600 }}>Signature</p>
            <pre style={{ background: "#f3f4f6", padding: 8, fontSize: 13, overflow: "auto", wordBreak: "break-all", whiteSpace: "pre-wrap" }}>
              {result.parts.signature}
            </pre>
          </div>
          <p style={{ fontSize: 12, color: "#6b7280" }}>
            Decoding only — signature is not verified. Never trust JWT contents without verifying the signature server-side.
          </p>
        </div>
      )}
    </div>
  );
}
