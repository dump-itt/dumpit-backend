import { prisma } from '@/lib/prisma'
import { generateRandomString } from '@/utils/generate-random-string'
import { hashPassword } from '@/utils/hash'

type CreateRepositoryRequest = {
  accessPassword?: string
  editPassword?: string
}

type CreateRepositoryResponse = {
  repository: {
    id: string
    createdAt: Date
  }
}

export class CreateRepositoryUseCase {
  async execute(
    data: CreateRepositoryRequest,
  ): Promise<CreateRepositoryResponse> {
    const id = generateRandomString(5)

    const repository = await prisma.repository.create({
      data: {
        id,
        accessPassword:
          data.accessPassword && (await hashPassword(data.accessPassword)),
        editPassword:
          data.editPassword && (await hashPassword(data.editPassword)),
      },
    })

    return {
      repository: {
        id: repository.id,
        createdAt: repository.createdAt,
      },
    }
  }
}
