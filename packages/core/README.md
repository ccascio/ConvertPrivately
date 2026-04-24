# @convertprivately/core

Framework-agnostic TypeScript functions for client-side file conversion. Zero server calls — everything runs in the user's browser.

[![Powered by ConvertPrivately](https://img.shields.io/badge/Powered%20by-ConvertPrivately-10b981)](https://convertprivately.com)

## Install

```bash
npm install @convertprivately/core
```

Heavy conversion libraries (`heic2any`, `pdf-lib`, `tesseract.js`, `@imgly/background-removal`, etc.) are **optional peer dependencies** — loaded dynamically only when you call a function that needs them. Install what you use:

```bash
npm install heic2any                    # HEIC decode
npm install browser-image-compression    # image compress
npm install pdf-lib                      # PDF operations
npm install pdfjs-dist                   # OCR on PDFs
npm install tesseract.js                 # OCR
npm install qrcode                       # QR generation
npm install papaparse                    # CSV ↔ JSON
```

## API shape

Every converter exports a single async function with a consistent signature:

```ts
convertX(input: File | Blob | ArrayBuffer, options?: ConvertXOptions): Promise<Blob>
```

- `input` — the source file or bytes.
- `options` — per-converter settings (format, quality, etc.).
- Returns a `Blob` ready for `URL.createObjectURL()` or download.

## Modules

Import each converter via a deep path to keep bundle size small:

```ts
import { heicToImage } from "@convertprivately/core/image/heic";
import { avifToImage } from "@convertprivately/core/image/avif";
import { compressImage } from "@convertprivately/core/image/compress";
import { compressPdf } from "@convertprivately/core/pdf/compress";
import { encodeBase64, decodeBase64 } from "@convertprivately/core/text/base64";
import { csvToJson, jsonToCsv } from "@convertprivately/core/text/csv-json";
import { convertUnit } from "@convertprivately/core/units";
import { recognizeText } from "@convertprivately/core/ocr";
import { generateQr } from "@convertprivately/core/qr";
```

## Example

```ts
import { heicToImage } from "@convertprivately/core/image/heic";

const blob = await heicToImage(file, { format: "jpeg", quality: 0.9 });
const url = URL.createObjectURL(blob);
```

## Privacy guarantee

Every function in this package:
1. Runs entirely in the browser — no `fetch()` to any server.
2. Loads optional dependencies from the user's own `node_modules` (no CDN unless you import from `esm.sh` yourself).
3. Returns results as `Blob`/`string`/`object` for local use or download.

Audit the source — it's small.

## License

MIT
