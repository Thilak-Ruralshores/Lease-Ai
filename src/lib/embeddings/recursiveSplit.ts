// lib/embeddings/recursiveSplit.ts

const MAX_CHARS = 2000;

export function recursiveSplit(
  text: string,
  maxChars = MAX_CHARS
): string[] {
  if (text.length <= maxChars) return [text];

  // 1️⃣ Try paragraph split
  const paragraphs = text.split(/\n\s*\n/);
  if (paragraphs.every(p => p.length <= maxChars)) {
    return paragraphs.flatMap(p => recursiveSplit(p, maxChars));
  }

  // 2️⃣ Try sentence split
  const sentences = text.split(/(?<=[.?!;])\s+/);
  if (sentences.every(s => s.length <= maxChars)) {
    return sentences.flatMap(s => recursiveSplit(s, maxChars));
  }

  // 3️⃣ Last resort: hard split
  const parts: string[] = [];
  let start = 0;
  while (start < text.length) {
    parts.push(text.slice(start, start + maxChars));
    start += maxChars;
  }
  return parts;
}
