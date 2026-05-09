const WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit",
  "sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore",
  "magna","aliqua","enim","ad","minim","veniam","quis","nostrud","exercitation",
  "ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis",
  "aute","irure","in","reprehenderit","voluptate","velit","esse","cillum",
  "fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non",
  "proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est",
  "perspiciatis","unde","omnis","iste","natus","error","voluptatem","accusantium",
  "doloremque","laudantium","totam","rem","aperiam","eaque","ipsa","quae","ab",
  "veritatis","architecto","beatae","vitae","dicta","explicabo","nemo","ipsam",
  "quia","voluptas","aspernatur","aut","odit","fugit","consequuntur","magni",
  "ratione","sequi","nesciunt","neque","porro","quisquam","dolorem","adipisci",
  "numquam","eius","modi","tempora","incidunt","quaerat","soluta","nobis",
  "eligendi","optio","cumque","nihil","impedit","quo","minus","maxime","placeat",
  "facere","possimus","assumenda","repellendus","temporibus","autem","quibusdam",
  "officiis","debitis","necessitatibus","saepe","eveniet","voluptates",
  "repudiandae","recusandae","itaque","earum","hic","tenetur","sapiente",
  "delectus","reiciendis","voluptatibus","maiores","alias",
];

function randomWord(exclude = ""): string {
  let w = WORDS[Math.floor(Math.random() * WORDS.length)];
  while (w === exclude) w = WORDS[Math.floor(Math.random() * WORDS.length)];
  return w;
}

function generateSentence(): string {
  const len = 8 + Math.floor(Math.random() * 12);
  const words: string[] = [];
  for (let i = 0; i < len; i++) words.push(randomWord(words[words.length - 1]));
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(sentenceCount: number): string {
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(" ");
}

export type LoremOutputType = "paragraphs" | "sentences" | "words";

export interface LoremIpsumOptions {
  type?: LoremOutputType;
  count?: number;
  startWithLorem?: boolean;
}

const LOREM_OPENING_PARA =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_OPENING_SENTENCE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

export function generateLoremIpsum(opts: LoremIpsumOptions = {}): string {
  const { type = "paragraphs", count = 3, startWithLorem = true } = opts;

  if (type === "words") {
    const words = Array.from({ length: count }, () => randomWord());
    if (startWithLorem && count > 0) words[0] = "Lorem";
    if (startWithLorem && count > 1) words[1] = "ipsum";
    return words.join(" ");
  }

  if (type === "sentences") {
    return Array.from({ length: count }, (_, i) => {
      if (i === 0 && startWithLorem) return LOREM_OPENING_SENTENCE;
      return generateSentence();
    }).join(" ");
  }

  return Array.from({ length: count }, (_, i) => {
    const sentPerPara = 4 + Math.floor(Math.random() * 4);
    const para = generateParagraph(sentPerPara);
    if (i === 0 && startWithLorem) return `${LOREM_OPENING_PARA} ${para}`;
    return para;
  }).join("\n\n");
}
