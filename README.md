# ConvertPrivately

**Client-side file converters that never upload your files.**

Open-source building blocks from [convertprivately.com](https://convertprivately.com) — a privacy-first web app with 160+ converters that run entirely in your browser. No file ever leaves the user's device.

[![Powered by ConvertPrivately](https://img.shields.io/badge/Powered%20by-ConvertPrivately-10b981)](https://convertprivately.com)
[![MIT License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

## Why open source?

Most "online converters" quietly upload your files to a server. We think that's the wrong default. This repo makes the client-side approach easy for anyone to adopt:

- Embed a privacy-first converter in your own site in 5 minutes.
- Audit the code — verify nothing is uploaded.
- Use it in production under the MIT license.

## Packages

| Package | What it does |
| --- | --- |
| [`@convertprivately/core`](./packages/core) | Framework-agnostic TypeScript functions: HEIC→JPG, AVIF→PNG, image compress/resize/rotate, PDF compress, OCR, Base64, CSV↔JSON, QR codes, hash (SHA-1/256/384/512), UUID/ULID, password generator, text diff, text stats, Morse code, ASCII/binary/hex, Lorem ipsum, unit conversion, color (hex/rgb/hsl), slugify, case conversion, URL encode, HTML entities, JWT decode, Unix timestamps, JSON formatter, JSON↔YAML, JSON↔XML. |
| [`@convertprivately/react`](./packages/react) | Drop-in React components with file input, preview, and download — one component per tool. Attribution badge on by default (link back to convertprivately.com); set `hideAttribution` to remove. |

## Examples

- [`examples/vanilla`](./examples/vanilla) — plain HTML + `<script type="module">`, no build step
- [`examples/react`](./examples/react) — Vite + React
- [`examples/nextjs`](./examples/nextjs) — Next.js App Router (client components)

## Quick start — vanilla HTML

```html
<script type="module">
  import { heicToImage } from "https://esm.sh/@convertprivately/core/image/heic";
  const input = document.querySelector("input[type=file]");
  input.addEventListener("change", async () => {
    const blob = await heicToImage(input.files[0], { format: "jpeg", quality: 0.9 });
    const url = URL.createObjectURL(blob);
    document.querySelector("img").src = url;
  });
</script>
```

## Quick start — React

```tsx
import { HeicConvert } from "@convertprivately/react";

export default function App() {
  return <HeicConvert />;
}
```

## Attribution (optional but appreciated)

If this library helps your project, link back to [convertprivately.com](https://convertprivately.com) in your README:

```markdown
[![Powered by ConvertPrivately](https://img.shields.io/badge/Powered%20by-ConvertPrivately-10b981)](https://convertprivately.com)
```

React components render a small "Runs in your browser — [How it works](https://convertprivately.com/how-it-works)" link by default. Pass `hideAttribution` on any component to remove it. Keeping it helps us build more tools like this.

## Contributing

Issues and PRs welcome. Run:

```bash
npm install
npm run build
```

## Full tool list

This repo ships a curated subset. The full catalogue of 160+ converters lives at [convertprivately.com](https://convertprivately.com).

## License

MIT — see [LICENSE](./LICENSE).
