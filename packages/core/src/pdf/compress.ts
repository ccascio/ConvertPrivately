import { toArrayBuffer, type ConvertInput } from "../types.js";

export interface PdfCompressOptions {
  useObjectStreams?: boolean;
  ignoreEncryption?: boolean;
}

export interface PdfCompressResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  ratio: number;
}

export async function compressPdf(
  input: ConvertInput,
  options: PdfCompressOptions = {},
): Promise<PdfCompressResult> {
  const { useObjectStreams = true, ignoreEncryption = true } = options;
  const buffer = await toArrayBuffer(input);
  const originalSize = buffer.byteLength;

  const { PDFDocument } = await import("pdf-lib");
  const doc = await PDFDocument.load(buffer, { ignoreEncryption });
  const bytes = await doc.save({ useObjectStreams });
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });

  return {
    blob,
    originalSize,
    compressedSize: blob.size,
    ratio: originalSize > 0 ? blob.size / originalSize : 1,
  };
}
