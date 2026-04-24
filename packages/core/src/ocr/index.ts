export interface OcrProgress {
  progress: number;
  status: string;
}

export interface OcrOptions {
  language?: string;
  onProgress?: (p: OcrProgress) => void;
}

export async function recognizeText(
  source: File | Blob | HTMLCanvasElement,
  options: OcrOptions = {},
): Promise<string> {
  const { language = "eng", onProgress } = options;
  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker(language, 1, {
    logger: (m: { status: string; progress: number }) => {
      onProgress?.({ progress: m.progress, status: m.status });
    },
  });

  try {
    const {
      data: { text },
    } = await worker.recognize(source);
    return text;
  } finally {
    await worker.terminate();
  }
}

export async function recognizePdfPages(
  file: File | Blob,
  options: OcrOptions = {},
): Promise<string[]> {
  const { language = "eng", onProgress } = options;
  const pdfjsLib: typeof import("pdfjs-dist") = await import("pdfjs-dist");
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).href;
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;
  const pages: string[] = [];

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.({
      progress: (i - 1) / totalPages,
      status: `Rendering page ${i} of ${totalPages}...`,
    });

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to acquire 2D canvas context.");
    await page.render({ canvasContext: ctx, viewport }).promise;

    const text = await recognizeText(canvas, {
      language,
      onProgress: (p) =>
        onProgress?.({
          progress: (i - 1 + p.progress) / totalPages,
          status: `Page ${i}/${totalPages}: ${p.status}`,
        }),
    });

    pages.push(text);
  }

  onProgress?.({ progress: 1, status: "Done" });
  return pages;
}
