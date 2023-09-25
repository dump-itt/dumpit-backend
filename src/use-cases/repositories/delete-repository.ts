import { prisma } from '@/lib/prisma'
import { getRepositoryUploadsDirPath } from '../../utils/get-repository-uploads-dir-path'
import { deleteFolderRecursively } from '@/utils/delete-folder-recursively'
import { ResourceNotFoundError, UnauthorizedError } from '@/errors/AppError'
import { AuthUseCaseRequest } from '../utils/auth-use-case-request'

interface DeleteRepositoryRequest extends AuthUseCaseRequest {
  id: string
}

type DeleteRepositoryResponse = void

export class DeleteRepositoryUseCase {
  async execute({
    id,
    sub,
    canEdit,
  }: DeleteRepositoryRequest): Promise<DeleteRepositoryResponse> {
    const repo = await prisma.repository.findUnique({ where: { id } })

    if (!repo) {
      throw ResourceNotFoundError
    }

    if (repo.editPassword && (sub !== repo.id || !canEdit)) {
      throw UnauthorizedError
    }

    const dir = getRepositoryUploadsDirPath(repo.id)

    await prisma.$transaction(async (tx) => {
      await tx.repository.delete({ where: { id } })

      deleteFolderRecursively(dir)
    })
  }
}
