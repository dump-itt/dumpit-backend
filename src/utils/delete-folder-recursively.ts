import * as fs from 'fs'
import * as path from 'path'

export function deleteFolderRecursively(folderPath: string): void {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file)

      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursively(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })

    fs.rmdirSync(folderPath)
  }
}
