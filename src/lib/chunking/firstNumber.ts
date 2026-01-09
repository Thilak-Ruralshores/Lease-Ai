export function firstNumber(sectionId: string): number | null {
  const n = sectionId.split(".")[0]
  return /^\d+$/.test(n) ? Number(n) : null
}