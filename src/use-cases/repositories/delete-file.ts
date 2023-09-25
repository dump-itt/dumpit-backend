import { prisma } from '@/lib/prisma'
import { getRepositoryUploadsDirPath } from '../../utils/get-repository-uploads-dir-path'
import { deleteFile } from '@/utils/delete-file'
import { ResourceNotFoundError, UnauthorizedError } from '@/errors/AppError'
import { fileExists } from '@/utils/file-exists'
import { AuthUseCaseRequest } from '../utils/auth-use-case-request'

interface DeleteFileRequest extends AuthUseCaseRequest {
  id: string
  sub?: string
}

type DeleteFileResponse = void

export class DeleteFileUseCase {
  async execute({
    id,
    sub,
    canEdit,
  }: DeleteFileRequest): Promise<DeleteFileResponse> {
    const file = await prisma.file.findUnique({
      where: { id },
      include: { repository: true },
    })

    if (!file) {
      throw ResourceNotFoundError
    }

    if (
      file.repository?.editPassword &&
      (!sub || sub !== file.repository.id) &&
      !canEdit
    ) {
      throw UnauthorizedError
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
