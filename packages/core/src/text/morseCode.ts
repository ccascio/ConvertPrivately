const MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
  G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
  M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
  S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...",
  "8": "---..", "9": "----.",
  " ": "/",
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k]),
);

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((c) => MORSE[c] ?? (c === "\n" ? "\n" : "?"))
    .join(" ")
    .replace(/ \/ /g, " / ");
}

export function morseToText(morse: string): string {
  return morse
    .split(" / ")
    .map((word) =>
      word
        .trim()
        .split(" ")
        .map((code) => (code ? (REVERSE_MORSE[code] ?? "?") : ""))
        .join(""),
    )
    .join(" ");
}

export { MORSE as MORSE_TABLE };
