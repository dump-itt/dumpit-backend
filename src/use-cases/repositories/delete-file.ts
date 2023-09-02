import { prisma } from '@/lib/prisma'
import { getRepositoryUploadsDirPath } from '../../utils/get-repository-uploads-dir-path'
import { deleteFile } from '@/utils/delete-file'
import { ResourceNotFoundError } from '@/errors/AppError'
import { fileExists } from '@/utils/file-exists'

type DeleteFileRequest = {
  id: string
}

type DeleteFileResponse = void

export class DeleteFileUseCase {
  async execute({ id }: DeleteFileRequest): Promise<DeleteFileResponse> {
    const file = await prisma.file.findUnique({ where: { id } })

    if (!file) {
      throw ResourceNotFoundError
    }

    const repositoryDir = getRepositoryUploadsDirPath(file.repositoryId)

    const filePath = `${repositoryDir}/${file.name}`

    if (!fileExists(filePath)) {
      await prisma.file.delete({ where: { id } })

      throw ResourceNotFoundError
    }

    await prisma.$transaction(async (tx) => {
      await tx.file.delete({ where: { id } })

      deleteFile(filePath)
    })
  }
}
