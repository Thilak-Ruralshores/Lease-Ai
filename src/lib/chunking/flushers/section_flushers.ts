import { hasMeaningfulText } from "@/lib/chunking/textRules";
import { activeSectionType } from "../types";
// let activeSection: activeSectionType | null = null
// let chunks: any[] = []
// let headingHasContent=false

export const flushActiveSection = (
  activeSection: activeSectionType | null,
  headingHasContent: boolean,
  chunks: any[]
) => {
  if (!activeSection) {
    return { activeSection, headingHasContent }
  }

  const text = activeSection.texts.join(" ")

  if (!hasMeaningfulText(text)) {
    return { activeSection: null, headingHasContent }
  }

  chunks.push({
    type: "section",
    heading_id: activeSection.heading_id,
    heading_title: activeSection.heading_title,
    section_id: activeSection.section_id,
    page_start: activeSection.page_start,
    page_end: activeSection.page_end,
    text
  })

  return {
    activeSection: null,
    headingHasContent: true
  }
}
