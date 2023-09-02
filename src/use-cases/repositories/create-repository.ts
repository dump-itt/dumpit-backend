import { prisma } from '@/lib/prisma'
import { generateRandomString } from '@/utils/generate-random-string'

type CreateRepositoryResponse = {
  repository: {
    id: string
  }
}

export class CreateRepositoryUseCase {
  async execute(): Promise<CreateRepositoryResponse> {
    const id = generateRandomString(5)

    const repository = await prisma.repository.create({
      data: {
        id,
      },
    })

    return {
      repository,
    }
  }
}
