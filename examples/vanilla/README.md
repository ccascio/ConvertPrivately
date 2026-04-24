# Vanilla HTML example

Open `index.html` directly in a browser, or serve with any static server:

```bash
npx serve .
```

No build step. ES modules are loaded from [esm.sh](https://esm.sh).

## What it shows

- HEIC → JPEG conversion via `@convertprivately/core/image/heic`
- Base64 encode/decode via `@convertprivately/core/text/base64`
- QR code generation via `@convertprivately/core/qr`

Open DevTools → Network to verify no file data leaves the browser.

## SEO

The example has `<meta name="robots" content="noindex, nofollow">` so it does not compete with [convertprivately.com](https://convertprivately.com) in search results. Remove it at your own risk if you fork this example.
