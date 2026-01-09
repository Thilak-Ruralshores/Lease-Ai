import { firstNumber } from "./firstNumber"


export function belongsToExhibit(
  sectionId: string,
  lastRealSectionId: string | null
): boolean {
  if (!lastRealSectionId) return true

  const prev = firstNumber(lastRealSectionId)
  const curr = firstNumber(sectionId)

  if (prev == null || curr == null) return true

  // Exhibit typically restarts numbering
  if (curr === 1 && prev > 1) return true

  // Backward numbering jump
  if (curr < prev) return true

  return false
}