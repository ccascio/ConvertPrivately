# @convertprivately/react

Drop-in React components for client-side file conversion. Built on top of [`@convertprivately/core`](../core). Nothing is uploaded.

[![Powered by ConvertPrivately](https://img.shields.io/badge/Powered%20by-ConvertPrivately-10b981)](https://convertprivately.com)

## Install

```bash
npm install @convertprivately/react @convertprivately/core
```

Then install the optional conversion libraries you need (see [core README](../core/README.md)).

## Usage

```tsx
import { HeicConvert, AvifConvert, ImageCompress } from "@convertprivately/react";

export default function App() {
  return (
    <div>
      <HeicConvert />
      <AvifConvert />
      <ImageCompress />
    </div>
  );
}
```

## Attribution

By default, each component renders a small "Runs in your browser — [How it works](https://convertprivately.com/how-it-works)" link. To remove it:

```tsx
<HeicConvert hideAttribution />
```

Keeping the link helps us build more open-source converters. Thank you.

## Styling

Components ship unstyled HTML with semantic class names (e.g. `cp-dropzone`, `cp-button`). Bring your own CSS, or import the optional default stylesheet:

```ts
import "@convertprivately/react/styles.css";
```

## License

MIT
