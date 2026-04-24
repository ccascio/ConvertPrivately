export interface AttributionBadgeProps {
  hide?: boolean;
}

export function AttributionBadge({ hide }: AttributionBadgeProps) {
  if (hide) return null;
  return (
    <p className="cp-attribution" style={{ fontSize: "0.75rem", color: "#047857", marginTop: "0.375rem" }}>
      Runs in your browser — nothing is uploaded ·{" "}
      <a
        href="https://convertprivately.com/how-it-works"
        target="_blank"
        rel="noopener"
        style={{ textDecoration: "underline", color: "inherit" }}
      >
        How it works
      </a>
    </p>
  );
}
