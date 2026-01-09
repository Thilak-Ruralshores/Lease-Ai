import pdf from "pdf-parse";
import fs from 'fs/promises'
// import mammoth from 'mammoth'

export async function parseFile(filePath: string, fileType: string | undefined) {
  try {

      const buffer=await fs.readFile(filePath)
      const data=await pdf(buffer)
      return data.text;//contains extracted pdf text
}catch(err:any){
  console.log('Error in Parsing :',err.message)
}
}