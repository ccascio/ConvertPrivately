export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  uniqueWords: number;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
}

export function computeTextStats(text: string): TextStats {
  const wordList = text.trim() ? text.trim().split(/\s+/) : [];
  const words = wordList.length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.trim()
    ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
    : 0;
  const paragraphs = text.trim()
    ? text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
    : 0;
  const lines = text ? text.split("\n").length : 0;
  const uniqueWords = new Set(
    wordList.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, "")),
  ).size;
  const readingTimeSeconds = Math.round((words / 200) * 60);
  const speakingTimeSeconds = Math.round((words / 130) * 60);

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
    uniqueWords,
    readingTimeSeconds,
    speakingTimeSeconds,
  };
}
