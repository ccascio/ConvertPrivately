import { toBlob, type ConvertInput } from "../types.js";

export type HeicOutputFormat = "jpeg" | "png" | "webp";

export interface HeicConvertOptions {
  format?: HeicOutputFormat;
  quality?: number;
}

export async function heicToImage(
  input: ConvertInput,
  options: HeicConvertOptions = {},
): Promise<Blob> {
  const { format = "jpeg", quality = 0.9 } = options;
  const blob = await toBlob(input);
  const heic2any = (await import("heic2any")).default;
  const result = (await heic2any({
    blob,
    toType: `image/${format}`,
    quality: format === "png" ? 1 : quality,
  })) as Blob | Blob[];
  return Array.isArray(result) ? result[0]! : result;
}
