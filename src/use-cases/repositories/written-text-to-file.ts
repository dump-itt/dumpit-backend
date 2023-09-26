import { ResourceNotFoundError } from '@/errors/AppError'
import { prisma } from '@/lib/prisma'
import { File as PrismaFile } from '@prisma/client'
import { randomUUID } from 'crypto'
import fs from 'fs'

type WrittenTextToFileRequest = {
  id: string // Repository ID
  text: string // Text content to save as a file
  fileName?: string // User-provided file name (optional)
}

type WrittenTextToFileResponse = {
  file: PrismaFile
}

export class WrittenTextToFileUseCase {
  async execute({
    id,
    text,
    fileName, // User-provided file name
  }: WrittenTextToFileRequest): Promise<WrittenTextToFileResponse> {
    const repo = await prisma.repository.findUnique({ where: { id } })

    if (!repo) {
      throw ResourceNotFoundError
    }

    // If a fileName is provided, ensure it does not contain invalid characters or paths.
    let sanitizedFileName = fileName
      ? fileName.replace(/[\\/:"*?<>|]/g, '_')
      : randomUUID()

    // Ensure that the file has a .txt extension
    if (!sanitizedFileName.endsWith('.txt')) {
      sanitizedFileName += '.txt'
    }

    // Define the path where the file will be saved
    const path = `${process.cwd()}/uploads/repositories/${id}/${sanitizedFileName}`
    const dirPath = `${process.cwd()}/uploads/repositories/${id}`

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    // Write the text content to the file
    fs.writeFileSync(path, text)

    // Create a database record for the file
    const dbFile = await prisma.file.create({
      data: {
        id: randomUUID(),
        name: sanitizedFileName,
        mimetype: 'text/plain', // Set the MIME type for .txt files
        repositoryId: repo.id,
      },
    })

    return {
      file: dbFile,
    }
  }
}
