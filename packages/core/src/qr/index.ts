export type QrErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QrOptions {
  size?: number;
  margin?: number;
  errorCorrectionLevel?: QrErrorCorrectionLevel;
  color?: { dark?: string; light?: string };
}

export async function generateQrDataUrl(text: string, options: QrOptions = {}): Promise<string> {
  const QRCode = (await import("qrcode")).default;
  return await QRCode.toDataURL(text, {
    width: options.size ?? 256,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
    color: options.color,
  });
}

export async function generateQrOnCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options: QrOptions = {},
): Promise<void> {
  const QRCode = (await import("qrcode")).default;
  await QRCode.toCanvas(canvas, text, {
    width: options.size ?? 256,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
    color: options.color,
  });
}

export async function generateQrSvg(text: string, options: QrOptions = {}): Promise<string> {
  const QRCode = (await import("qrcode")).default;
  return await QRCode.toString(text, {
    type: "svg",
    width: options.size ?? 256,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
    color: options.color,
  });
}
