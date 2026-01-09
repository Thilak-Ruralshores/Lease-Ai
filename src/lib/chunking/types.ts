
export type Block = {
  type: string
  heading_id?: string
  section_id?: string | null
  title?: string | null
  text?: string
  page: number
}

export interface currentHeadingType{
    id: string
    title?: string
    texts: string[]
    page?: number
}
export interface atomicGroupType{
   parentId: string
    texts: string[]
    pageStart: number
    pageEnd: number 
}

export interface activeSectionType{
    section_id: string
    heading_id?: string
    heading_title?: string
    texts: string[]
    page_start: number
    page_end: number
  }

 export interface headingBodySectionType{
    heading_id: string
    heading_title?: string
    section_id: string
    texts: string[]
    page_start: number
    page_end: number
  }

  export interface exhibitType{
    title?: string
    texts: string[]
    pageStart: number
    pageEnd: number
  }
   export  interface miscType{
    title?: string
    texts: string[]
    pageStart: number
    pageEnd: number
  }