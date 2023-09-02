import fs from 'fs'

export function deleteFile(path: string) {
  fs.unlinkSync(path)
}
