import { useMemo, useState } from "react";
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, formatRgb, formatHsl } from "@convertprivately/core/units/color";
import { AttributionBadge } from "./AttributionBadge.js";

export interface ColorConverterProps {
  hideAttribution?: boolean;
  className?: string;
}

export function ColorConverter({ hideAttribution, className }: ColorConverterProps) {
  const [hex, setHex] = useState("#10b981");

  const result = useMemo(() => {
    try {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb);
      return { ok: true as const, rgb, hsl, hexNorm: rgbToHex(rgb) };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  }, [hex]);

  function setFromRgb(rgb: { r: number; g: number; b: number }) {
    setHex(rgbToHex(rgb));
  }

  function setFromHsl(hsl: { h: number; s: number; l: number }) {
    setFromRgb(hslToRgb(hsl));
  }

  return (
    <div className={`cp-tool cp-color ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <input
          type="color"
          value={result.ok ? result.hexNorm.slice(0, 7) : "#000000"}
          onChange={(e) => setHex(e.target.value)}
          style={{ width: 48, height: 48, border: 0, padding: 0 }}
        />
        <input
          type="text"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#10b981"
          style={{ fontFamily: "monospace", padding: 6, flex: 1 }}
        />
      </div>
      {!result.ok && <p style={{ color: "#dc2626" }}>{result.error}</p>}
      {result.ok && (
        <div style={{ display: "grid", gap: 10 }}>
          <Field label="HEX" value={result.hexNorm} onChange={setHex} />
          <Field
            label="RGB"
            value={formatRgb(result.rgb)}
            onChange={(v) => {
              const m = v.match(/(\d+)[^\d]+(\d+)[^\d]+(\d+)/);
              if (m) setFromRgb({ r: +m[1]!, g: +m[2]!, b: +m[3]! });
            }}
          />
          <Field
            label="HSL"
            value={formatHsl(result.hsl)}
            onChange={(v) => {
              const m = v.match(/(\d+)[^\d]+(\d+)[^\d]+(\d+)/);
              if (m) setFromHsl({ h: +m[1]!, s: +m[2]!, l: +m[3]! });
            }}
          />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontFamily: "monospace", padding: 6 }}
      />
    </label>
  );
}
