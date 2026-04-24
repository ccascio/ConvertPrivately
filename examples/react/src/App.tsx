import {
  HeicConvert,
  AvifConvert,
  ImageCompress,
  PdfCompress,
  Base64,
  CsvJson,
  UnitConverter,
  OcrTool,
  QrCode,
} from "@convertprivately/react";

const wrapper: React.CSSProperties = {
  fontFamily: "system-ui, sans-serif",
  maxWidth: 720,
  margin: "2rem auto",
  padding: "0 1rem",
};

const section: React.CSSProperties = {
  margin: "2rem 0",
  padding: "1rem",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
};

export function App() {
  return (
    <div style={wrapper}>
      <h1>ConvertPrivately — React Example</h1>
      <p>
        All 10 pilot converters rendered side by side. Everything runs in the browser — open
        DevTools → Network to verify.
      </p>

      <section style={section}>
        <h2>HEIC convert</h2>
        <HeicConvert />
      </section>
      <section style={section}>
        <h2>AVIF convert</h2>
        <AvifConvert />
      </section>
      <section style={section}>
        <h2>Image compress</h2>
        <ImageCompress />
      </section>
      <section style={section}>
        <h2>PDF compress</h2>
        <PdfCompress />
      </section>
      <section style={section}>
        <h2>Base64</h2>
        <Base64 />
      </section>
      <section style={section}>
        <h2>CSV ↔ JSON</h2>
        <CsvJson />
      </section>
      <section style={section}>
        <h2>Unit converter (length)</h2>
        <UnitConverter category="length" />
      </section>
      <section style={section}>
        <h2>OCR</h2>
        <OcrTool />
      </section>
      <section style={section}>
        <h2>QR code</h2>
        <QrCode />
      </section>
    </div>
  );
}
