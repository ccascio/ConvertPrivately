export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export function decodeJwt(token: string): JwtParts {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT: expected three dot-separated segments.");
  }
  const [h, p, s] = parts as [string, string, string];
  return {
    header: parseSegment(h),
    payload: parseSegment(p),
    signature: s,
  };
}

function parseSegment(seg: string): Record<string, unknown> {
  const padded = seg.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const binary = atob(padded + "=".repeat(padLen));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json) as Record<string, unknown>;
}
