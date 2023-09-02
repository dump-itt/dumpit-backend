import { ResourceNotFoundError } from '@/errors/AppError'
import { prisma } from '@/lib/prisma'
import { Repository } from '@prisma/client'

type GetRepositoryRequest = {
  id: string
}

type GetRepositoryResponse = {
  repository: Repository
}

export class GetRepositoryUseCase {
  async execute({ id }: GetRepositoryRequest): Promise<GetRepositoryResponse> {
    const repository = await prisma.repository.findUnique({
      where: {
        id,
      },
      include: {
        files: true,
      },
    })

    if (!repository) {
      throw ResourceNotFoundError
    }

    return {
      repository,
    }
  }
}
