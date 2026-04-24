import { toBlob, type ConvertInput } from "../types.js";

export type AvifOutputFormat = "jpeg" | "png" | "webp";

export interface AvifConvertOptions {
  format?: AvifOutputFormat;
  quality?: number;
}

export async function avifToImage(
  input: ConvertInput,
  options: AvifConvertOptions = {},
): Promise<Blob> {
  const { format = "jpeg", quality = 0.92 } = options;
  const sourceBlob = await toBlob(input);
  const mimeType = `image/${format}`;

  const url = URL.createObjectURL(sourceBlob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to acquire 2D canvas context.");
    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    return await canvasToBlob(canvas, mimeType, format === "png" ? undefined : quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(
        new Error(
          "Could not load the image. Ensure the file is valid AVIF and the browser supports AVIF (Chrome, Edge, Firefox, Safari 16.4+).",
        ),
      );
    img.src = src;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number | undefined,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("canvas.toBlob returned null."))),
      mimeType,
      quality,
    );
  });
}
