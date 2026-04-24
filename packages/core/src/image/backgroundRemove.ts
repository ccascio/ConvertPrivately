import { toBlob, type ConvertInput } from "../types.js";

export interface BackgroundRemoveOptions {
  onProgress?: (progress: number) => void;
}

/**
 * Remove the background from an image — entirely in the browser using a local ONNX model.
 *
 * Heavy first run: @imgly/background-removal downloads ~20MB of WASM + model on first use.
 * It is cached in the browser afterward. Show a loading UI.
 */
export async function removeBackground(
  input: ConvertInput,
  options: BackgroundRemoveOptions = {},
): Promise<Blob> {
  const blob = await toBlob(input);
  const { removeBackground: imglyRemove } = await import("@imgly/background-removal");
  const config: Record<string, unknown> = {};
  if (options.onProgress) {
    config.progress = (_key: string, current: number, total: number) => {
      if (total > 0) options.onProgress!(current / total);
    };
  }
  return await imglyRemove(blob, config);
}
