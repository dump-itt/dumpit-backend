import { prisma } from '@/lib/prisma'
import { getRepositoryUploadsDirPath } from '../../utils/get-repository-uploads-dir-path'
import { deleteFolderRecursively } from '@/utils/delete-folder-recursively'

type DeleteRepositoryResponse = void

export class DeleteExpiredRepositories {
  async execute(): Promise<DeleteRepositoryResponse> {
    try {
      const twentyFourHoursAgo = new Date()

      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

      const repositoriesToDelete = await prisma.repository.findMany({
        where: {
          createdAt: { lte: twentyFourHoursAgo },
        },
      })

      await prisma.$transaction(async (tx) => {
        for await (const repository of repositoriesToDelete) {
          const dir = getRepositoryUploadsDirPath(repository.id)

          await tx.repository.delete({ where: { id: repository.id } })

          deleteFolderRecursively(dir)
        }
      })
    } catch {
      console.log('Error while deleting expired repositories')
    }
  }
}
