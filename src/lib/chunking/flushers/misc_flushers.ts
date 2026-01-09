import { miscType } from "../types";

// let miscGroup: miscType | null = null
// let chunks: any[] = []

export const flushMisc = (miscGroup:miscType | null,chunks:any[]) => {
    if (!miscGroup) return {miscGroup}

    chunks.push({
      type: "miscellaneous",
      title: miscGroup.title,
      page_start: miscGroup.pageStart,
      page_end: miscGroup.pageEnd,
      text: miscGroup.texts.join(" ")
    })

    return {miscGroup : null}
  }