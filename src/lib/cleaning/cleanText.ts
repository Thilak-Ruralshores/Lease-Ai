export function cleanText(rawText: string): string {
  let text = rawText;

  // 1. Normalize line endings
  text = text.replace(/\r\n/g, "\n");

  // 2. Remove excessive spaces & tabs
  text = text.replace(/[ \t]+/g, " ");

  // 3. Remove repeating headers/footers (simple heuristic)
  const lines = text.split("\n");
  const lineFrequency = new Map<string, number>();

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0) {
      lineFrequency.set(trimmed, (lineFrequency.get(trimmed) || 0) + 1);
    }
  }

  const cleanedLines = lines.filter(line => {
    const trimmed = line.trim();

    // Remove lines repeated many times (likely header/footer)
    if (lineFrequency.get(trimmed)! > 5 && trimmed.length < 80) {
      return false;
    }

    return true;
  });

  text = cleanedLines.join("\n");

  // 4. Remove isolated page numbers
  text = text.replace(/^\s*-?\s*\d+\s*-?\s*$/gm, "");

  // 5. Join broken lines within paragraphs
  text = text.replace(
    /([a-zA-Z0-9,;])\n(?=[a-zA-Z])/g,
    "$1 "
  );

  // 6. Normalize bullet symbols
  text = text.replace(/[•▪▪]/g, "-");

  // 7. Collapse multiple newlines (but keep paragraph breaks)
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}
