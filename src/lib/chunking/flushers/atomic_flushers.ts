     
import { atomicGroupType,currentHeadingType } from "../types";  

   let headingHasContent = false
  export const flushAtomicGroup = (currentHeading:currentHeadingType|null,atomicGroup:atomicGroupType | null,chunks:any[]) => {
    if (!atomicGroup) return {atomicGroup,headingHasContent}
    console.log(currentHeading?.title,currentHeading?.page,"Flushing atomic group")
    chunks.push({
      type: "grouped_section",
      parent_section_id: atomicGroup.parentId,
      heading_id: currentHeading?.id,
      heading_title: currentHeading?.title,
      page_start: atomicGroup.pageStart,
      page_end: atomicGroup.pageEnd,
      text: atomicGroup.texts.join(" ")
    })

   return {headingHasContent : true,
    atomicGroup : null}
  }