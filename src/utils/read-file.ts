import fs from 'fs'

export function readFile(path: string) {
  const fileContent = fs.readFileSync(path)

  return fileContent
}
