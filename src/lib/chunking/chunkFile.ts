import { Block } from "../chunking/types"
import {
  atomicGroupType,
  activeSectionType,
  currentHeadingType,
  exhibitType,
  headingBodySectionType,
  miscType
} from "./types"

import {
  flushHeadingBodySection,
  flushHeadingIfEmpty
} from "./flushers/heading_flushers"

import { flushActiveSection } from "./flushers/section_flushers"
import { flushAtomicGroup } from "./flushers/atomic_flushers"
import { flushExhibit } from "./flushers/exhibit_flushers"
import { flushMisc } from "./flushers/misc_flushers"
import { belongsToExhibit } from "./belongsToExhibit" 

export function buildContextChunks(blocks: Block[]) {
  const chunks: any[] = []

  let currentHeading: currentHeadingType | null = null
  let headingHasContent = false

  let atomicGroup: atomicGroupType | null = null
  let activeSection: activeSectionType | null = null
  let headingBodySection: headingBodySectionType | null = null
  let exhibitGroup: exhibitType | null = null
  let miscGroup: miscType | null = null

  let lastNonExhibitSectionId: string | null = null


  for (const block of blocks) {

    // ================= EXHIBIT START =================
    if (block.type === "exhibit_start") {
      ;({ headingBodySection } =
        flushHeadingBodySection(headingBodySection, chunks))

      ;({ activeSection, headingHasContent } =
        flushActiveSection(activeSection, headingHasContent, chunks))

      ;({ atomicGroup } =
        flushAtomicGroup(currentHeading, atomicGroup, chunks))

      ;({ miscGroup } =
        flushMisc(miscGroup, chunks))

      ;({ exhibitGroup } =
        flushExhibit(exhibitGroup, chunks))

      exhibitGroup = {
        title: block.title ?? block.text,
        texts: [block.text ?? ""],
        pageStart: block.page,
        pageEnd: block.page
      }
      continue
    }

    // ================= EXHIBIT BODY =================
    if (block.type === "exhibit_body") {
      if (!exhibitGroup) {
        exhibitGroup = { texts: [], pageStart: block.page, pageEnd: block.page }
      }
      exhibitGroup.texts.push(block.text ?? "")
      exhibitGroup.pageEnd = block.page
      continue
    }

    // ================= HEADING =================
    if (block.type === "heading_start") {
      ;({ headingBodySection } =
        flushHeadingBodySection(headingBodySection, chunks))

      ;({ activeSection, headingHasContent } =
        flushActiveSection(activeSection, headingHasContent, chunks))

      ;({ atomicGroup } =
        flushAtomicGroup(currentHeading, atomicGroup, chunks))

      ;({ exhibitGroup } =
        flushExhibit(exhibitGroup, chunks))

      ;({ miscGroup } =
        flushMisc(miscGroup, chunks))

      flushHeadingIfEmpty(currentHeading, headingHasContent, chunks)

      currentHeading = {
        id: block.heading_id!,
        title: block.title ?? "",
        texts: [],
        page: block.page
      }
      headingHasContent = false
      continue
    }

    if (block.type === "heading_body" && currentHeading) {
      currentHeading.texts.push(block.text ?? "")
      headingHasContent = true

      headingBodySection = {
        heading_id: currentHeading.id,
        heading_title: currentHeading.title,
        section_id: currentHeading.id,
        texts: currentHeading.texts,
        page_start: currentHeading.page ?? block.page,
        page_end: block.page
      }
      continue
    }

    // ================= SECTION =================
    if (block.type === "section_start" || block.type === "section_body") {
      if (!block.section_id) continue

      // ---- If inside Exhibit, decide whether section belongs to exhibit
      if (exhibitGroup) {
        const shouldStayInExhibit = belongsToExhibit(
          block.section_id,
          lastNonExhibitSectionId
        )

        if (shouldStayInExhibit) {
          exhibitGroup.texts.push(block.text ?? "")
          exhibitGroup.pageEnd = block.page
          continue
        } else {
          ;({ exhibitGroup } =
            flushExhibit(exhibitGroup, chunks))
        }
      }

      // ---- Track last real section
      lastNonExhibitSectionId = block.section_id

      const parts = block.section_id.split(".")
      const isAtomic =
        parts.length === 4 && parts.every(p => /^\d+$/.test(p))

      // ---- ATOMIC SECTION ----
      if (isAtomic) {
        ;({ headingBodySection } =
          flushHeadingBodySection(headingBodySection, chunks))

        ;({ activeSection, headingHasContent } =
          flushActiveSection(activeSection, headingHasContent, chunks))

        const parentId = parts.slice(0, 3).join(".")

        if (!atomicGroup || atomicGroup.parentId !== parentId) {
          ;({ atomicGroup } =
            flushAtomicGroup(currentHeading, atomicGroup, chunks))

          atomicGroup = {
            parentId,
            texts: [],
            pageStart: block.page,
            pageEnd: block.page
          }
        }

        atomicGroup.texts.push(block.text ?? "")
        atomicGroup.pageEnd = block.page
        continue
      }

      // ---- NORMAL SECTION ----
      ;({ headingBodySection } =
        flushHeadingBodySection(headingBodySection, chunks))

      ;({ atomicGroup } =
        flushAtomicGroup(currentHeading, atomicGroup, chunks))

      if (!activeSection || activeSection.section_id !== block.section_id) {
        ;({ activeSection, headingHasContent } =
          flushActiveSection(activeSection, headingHasContent, chunks))

        activeSection = {
          section_id: block.section_id,
          heading_id: currentHeading?.id,
          heading_title: currentHeading?.title,
          texts: [],
          page_start: block.page,
          page_end: block.page
        }
      }

      activeSection.texts.push(block.text ?? "")
      activeSection.page_end = block.page
      headingHasContent = true
      continue
    }

    // ================= MISC / SCHEDULE =================
    if (block.type === "misc_start" || block.type === "schedule_start") {
      ;({ headingBodySection } =
        flushHeadingBodySection(headingBodySection, chunks))

      ;({ activeSection, headingHasContent } =
        flushActiveSection(activeSection, headingHasContent, chunks))

      ;({ atomicGroup } =
        flushAtomicGroup(currentHeading, atomicGroup, chunks))

      ;({ exhibitGroup } =
        flushExhibit(exhibitGroup, chunks))

      ;({ miscGroup } =
        flushMisc(miscGroup, chunks))

      miscGroup = {
        title: block.title ?? block.text,
        texts: [block.text ?? ""],
        pageStart: block.page,
        pageEnd: block.page
      }
      continue
    }

    if (block.type === "misc_body" || block.type === "schedule_body") {
      if (!miscGroup) {
        miscGroup = { texts: [], pageStart: block.page, pageEnd: block.page }
      }
      miscGroup.texts.push(block.text ?? "")
      miscGroup.pageEnd = block.page
      continue
    }
  }

  // ================= FINAL FLUSH =================
  ;({ headingBodySection } =
    flushHeadingBodySection(headingBodySection, chunks))

  ;({ activeSection, headingHasContent } =
    flushActiveSection(activeSection, headingHasContent, chunks))

  ;({ atomicGroup } =
    flushAtomicGroup(currentHeading, atomicGroup, chunks))

  ;({ exhibitGroup } =
    flushExhibit(exhibitGroup, chunks))

  flushHeadingIfEmpty(currentHeading, headingHasContent, chunks)

  ;({ miscGroup } =
    flushMisc(miscGroup, chunks))

  return chunks
}
