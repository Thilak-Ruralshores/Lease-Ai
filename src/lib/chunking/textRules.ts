export const hasMeaningfulText = (text: string): boolean => {
  const cleaned = text
    .replace(/[\s\.\-–—_]+/g, "")
    .trim()

  return cleaned.length >= 5
}
// This might go wrong for Artcile 1 as it doesn't have 4 letters if 1 is taken separately