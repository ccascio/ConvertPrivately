# Next.js example

App Router skeleton. Components must be rendered as client components because they use browser APIs (Canvas, File, Blob, Workers).

## Setup

```bash
npx create-next-app@latest my-app --ts --app --no-tailwind
cd my-app
npm install @convertprivately/core @convertprivately/react \
  heic2any browser-image-compression pdf-lib \
  tesseract.js qrcode papaparse @imgly/background-removal
```

## app/page.tsx

```tsx
"use client";

import { HeicConvert } from "@convertprivately/react";

export default function Page() {
  return (
    <main>
      <h1>Convert HEIC privately</h1>
      <HeicConvert />
    </main>
  );
}
```

The `"use client"` directive is required — these components use `useState`, `useRef`, and browser-only APIs.

## SEO note

Add `noindex` to pages that mirror convertprivately.com tools, or apply `canonical` pointing at the canonical URL on convertprivately.com, to avoid SEO cannibalization.

```tsx
// app/convert-heic/page.tsx
export const metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: "https://convertprivately.com/heic-convert" },
};
```
