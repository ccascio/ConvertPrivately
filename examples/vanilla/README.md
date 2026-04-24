# Vanilla HTML example

Plain HTML using `<script type="module">` — no build step for the example itself, but the `@convertprivately/core` package must be built first.

## Run it

From the repo root:

```bash
npm install
npm run build --workspace @convertprivately/core
cd examples/vanilla
npx serve .
```

Then open http://localhost:3000.

The example imports from the locally-built `../../packages/core/dist/`. After we publish to npm you can swap those paths for `https://esm.sh/@convertprivately/core/...` and drop the relative imports.

## What it shows

- HEIC → JPEG conversion via `@convertprivately/core/image/heic`
- Base64 encode/decode via `@convertprivately/core/text/base64`
- QR code generation via `@convertprivately/core/qr`

Open DevTools → Network to verify no file data leaves the browser.

## SEO

The example has `<meta name="robots" content="noindex, nofollow">` so it does not compete with [convertprivately.com](https://convertprivately.com) in search results. Remove at your own risk if you fork this example.
