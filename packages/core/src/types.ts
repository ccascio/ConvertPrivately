export type ConvertInput = File | Blob | ArrayBuffer | Uint8Array;

export async function toBlob(input: ConvertInput, mimeType?: string): Promise<Blob> {
  if (input instanceof Blob) return input;
  if (input instanceof ArrayBuffer) return new Blob([input], mimeType ? { type: mimeType } : undefined);
  if (input instanceof Uint8Array) {
    return new Blob([input.buffer as ArrayBuffer], mimeType ? { type: mimeType } : undefined);
  }
  throw new TypeError("Unsupported input type. Expected File, Blob, ArrayBuffer, or Uint8Array.");
}

export async function toArrayBuffer(input: ConvertInput): Promise<ArrayBuffer> {
  if (input instanceof ArrayBuffer) return input;
  if (input instanceof Uint8Array) return input.buffer as ArrayBuffer;
  if (input instanceof Blob) return await input.arrayBuffer();
  throw new TypeError("Unsupported input type. Expected File, Blob, ArrayBuffer, or Uint8Array.");
}
