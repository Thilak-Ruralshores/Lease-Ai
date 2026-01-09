import { hasMeaningfulText } from "@/lib/chunking/textRules";
import { currentHeadingType, headingBodySectionType } from "../types";    


export const flushHeadingBodySection = (
  headingBodySection: headingBodySectionType | null,
  chunks: any[]
) => {
  if (!headingBodySection) {
    return { headingBodySection }
  }
  
  const text = headingBodySection.texts.join(" ")

  if (!hasMeaningfulText(text)) {
    return { headingBodySection: null }
  }

  chunks.push({
    type: "section",
    heading_id: headingBodySection.heading_id,
    heading_title: headingBodySection.heading_title,
    section_id: headingBodySection.section_id,
    page_start: headingBodySection.page_start,
    page_end: headingBodySection.page_end,
    text
  })

  return { headingBodySection: null }
}


export const flushHeadingIfEmpty = (
  currentHeading: currentHeadingType | null,
  headingHasContent: boolean,
  chunks: any[]
) => {
  if (!currentHeading || headingHasContent) return

  chunks.push({
    type: "heading_only",
    heading_id: currentHeading.id,
    title: currentHeading.title,
    page: currentHeading.page
  })
}