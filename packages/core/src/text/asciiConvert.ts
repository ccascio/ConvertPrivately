export function textToAscii(text: string): string {
  return text.split("").map((c) => c.charCodeAt(0)).join(" ");
}

export function textToBinary(text: string): string {
  return text.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
}

export function textToHex(text: string): string {
  return text
    .split("")
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
}

export function fromEncoded(input: string): string {
  const tokens = input.trim().split(/\s+/);
  if (tokens.every((t) => /^[01]{8}$/.test(t))) {
    return tokens.map((t) => String.fromCharCode(parseInt(t, 2))).join("");
  }
  if (tokens.every((t) => /^[0-9A-Fa-f]{1,2}$/.test(t))) {
    return tokens.map((t) => String.fromCharCode(parseInt(t, 16))).join("");
  }
  return tokens
    .map((t) => {
      const code = parseInt(t, 10);
      return isNaN(code) ? "?" : String.fromCharCode(code);
    })
    .join("");
}
