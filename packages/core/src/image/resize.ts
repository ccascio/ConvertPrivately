import { toBlob } from "../types.js";
import type { ConvertInput } from "../types.js";

export interface ResizeImageOptions {
  /** Target width in pixels. Required unless mode is "percentage" or "maxDimension". */
  width?: number;
  /** Target height in pixels. */
  height?: number;
  /** Scale by percentage (1–500). */
  percentage?: number;
  /** Max side length; maintains aspect ratio. */
  maxDimension?: number;
  /** Output format. Default: "image/png" */
  format?: "image/png" | "image/jpeg" | "image/webp";
  /** Quality 0–1 for JPEG/WebP. Default: 0.92 */
  quality?: number;
  /** Lock aspect ratio when only width or height is provided. Default: true */
  lockAspect?: boolean;
}

export interface ResizeImageResult {
  blob: Blob;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export async function resizeImage(
  input: ConvertInput,
  opts: ResizeImageOptions = {},
): Promise<ResizeImageResult> {
  const blob = await toBlob(input);
  const url = URL.createObjectURL(blob);
  let img: HTMLImageElement;
  try {
    img = await loadImage(url);
  } finally {
    URL.revokeObjectURL(url);
  }

  const { naturalWidth: srcW, naturalHeight: srcH } = img;
  const format = opts.format ?? "image/png";
  const quality = opts.quality ?? 0.92;
  const lockAspect = opts.lockAspect !== false;

  let targetW: number;
  let targetH: number;

  if (opts.maxDimension !== undefined) {
    const ratio = Math.min(opts.maxDimension / srcW, opts.maxDimension / srcH, 1);
    targetW = Math.round(srcW * ratio);
    targetH = Math.round(srcH * ratio);
  } else if (opts.percentage !== undefined) {
    const pct = opts.percentage / 100;
    targetW = Math.round(srcW * pct);
    targetH = Math.round(srcH * pct);
  } else {
    targetW = opts.width ?? srcW;
    targetH = opts.height ?? srcH;
    if (lockAspect) {
      if (opts.width !== undefined && opts.height === undefined) {
        targetH = Math.round((targetW / srcW) * srcH);
      } else if (opts.height !== undefined && opts.width === undefined) {
        targetW = Math.round((targetH / srcH) * srcW);
      }
    }
  }

  if (targetW < 1 || targetH < 1) throw new Error("Target dimensions must be at least 1px");
  if (targetW > 16383 || targetH > 16383) throw new Error("Max dimension is 16383px");

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;
  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);
  }
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const resultBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("canvas.toBlob failed"))),
      format,
      format === "image/png" ? undefined : quality,
    );
  });

  return { blob: resultBlob, width: targetW, height: targetH };
}
