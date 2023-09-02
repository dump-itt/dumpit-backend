import { prisma } from '@/lib/prisma'
import { getRepositoryUploadsDirPath } from '../../utils/get-repository-uploads-dir-path'
import { deleteFolderRecursively } from '@/utils/delete-folder-recursively'
import { ResourceNotFoundError } from '@/errors/AppError'

type DeleteRepositoryRequest = {
  id: string
}

type DeleteRepositoryResponse = void

export class DeleteRepositoryUseCase {
  async execute({
    id,
  }: DeleteRepositoryRequest): Promise<DeleteRepositoryResponse> {
    const repo = await prisma.repository.findUnique({ where: { id } })

    if (!repo) {
      throw ResourceNotFoundError
    }

    const dir = getRepositoryUploadsDirPath(repo.id)

    await prisma.$transaction(async (tx) => {
      await tx.repository.delete({ where: { id } })

      deleteFolderRecursively(dir)
    })
  }
}
