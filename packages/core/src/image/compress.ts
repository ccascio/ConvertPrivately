import { toBlob, type ConvertInput } from "../types.js";

export interface ImageCompressOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  initialQuality?: number;
}

export interface ImageCompressResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  ratio: number;
}

export async function compressImage(
  input: ConvertInput,
  options: ImageCompressOptions = {},
): Promise<ImageCompressResult> {
  const {
    maxSizeMB = 1,
    maxWidthOrHeight = 1920,
    useWebWorker = true,
    initialQuality,
  } = options;

  const source = await toBlob(input);
  const originalSize = source.size;
  const file = source instanceof File ? source : new File([source], "input", { type: source.type });

  const imageCompression = (await import("browser-image-compression")).default;
  const compressed = await imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker,
    ...(initialQuality !== undefined ? { initialQuality } : {}),
  });

  return {
    blob: compressed,
    originalSize,
    compressedSize: compressed.size,
    ratio: originalSize > 0 ? compressed.size / originalSize : 1,
  };
}
