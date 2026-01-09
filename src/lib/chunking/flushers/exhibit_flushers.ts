import { exhibitType } from "../types"

// let exhibitGroup: exhibitType | null = null
// let chunks: any[] = []
export const flushExhibit = (exhibitGroup:exhibitType|null,chunks:any[]) => {
    if (!exhibitGroup) return {exhibitGroup}

    chunks.push({
      type: "exhibit",
      title: exhibitGroup.title,
      page_start: exhibitGroup.pageStart,
      page_end: exhibitGroup.pageEnd,
      text: exhibitGroup.texts.join(" ")
    })

   return { exhibitGroup  : null }
  }