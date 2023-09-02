import { prisma } from '@/lib/prisma'
import { getRepositoryUploadsDirPath } from '../../utils/get-repository-uploads-dir-path'
import { readFile } from '@/utils/read-file'
import mime from 'mime'
import { ResourceNotFoundError } from '@/errors/AppError'
import { fileExists } from '@/utils/file-exists'

type GetFileContentRequest = {
  id: string
}

type GetFileContentResponse = {
  file: {
    path: string
    content: Buffer
    mimetype: string
  }
}

export class GetFileContentUseCase {
  async execute({
    id,
  }: GetFileContentRequest): Promise<GetFileContentResponse> {
    const file = await prisma.file.findUnique({ where: { id } })

    if (!file) {
      throw ResourceNotFoundError
    }

    const repositoryPath = getRepositoryUploadsDirPath(file.repositoryId)

    const filePath = `${repositoryPath}/${file.name}`

    if (!fileExists(filePath)) {
      await prisma.file.delete({ where: { id } })

      throw ResourceNotFoundError
    }

    const fileContent = readFile(filePath)

    const mimetype = mime.getType(filePath)

    if (!mimetype) {
      throw new Error()
    }

    return {
      file: {
        mimetype,
        path: filePath,
        content: fileContent,
      },
    }
  }
}
