import { useMemo, useState } from "react";
import { computeTextStats } from "@convertprivately/core/text/text-stats";
import { AttributionBadge } from "./AttributionBadge.js";

export interface TextStatsProps {
  hideAttribution?: boolean;
  className?: string;
  defaultText?: string;
}

function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function TextStats({ hideAttribution, className, defaultText = "" }: TextStatsProps) {
  const [text, setText] = useState(defaultText);
  const stats = useMemo(() => computeTextStats(text), [text]);

  const items = [
    { label: "Words", value: stats.words.toLocaleString() },
    { label: "Characters", value: stats.characters.toLocaleString(), sub: "incl. spaces" },
    { label: "Characters", value: stats.charactersNoSpaces.toLocaleString(), sub: "no spaces" },
    { label: "Sentences", value: stats.sentences.toLocaleString() },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "Lines", value: stats.lines.toLocaleString() },
    { label: "Unique Words", value: stats.uniqueWords.toLocaleString() },
    { label: "Reading Time", value: fmtTime(stats.readingTimeSeconds), sub: "200 wpm" },
    { label: "Speaking Time", value: fmtTime(stats.speakingTimeSeconds), sub: "130 wpm" },
  ];

  return (
    <div className={`cp-tool cp-text-stats ${className ?? ""}`}>
      <AttributionBadge hide={hideAttribution} />

      <textarea
        className="cp-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        rows={8}
        style={{ width: "100%", marginBottom: 16 }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 6, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{item.value}</div>
            {item.sub && <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{item.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
