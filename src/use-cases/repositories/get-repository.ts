import { ResourceNotFoundError, UnauthorizedError } from '@/errors/AppError'
import { prisma } from '@/lib/prisma'
import { Repository } from '@prisma/client'
import { AuthUseCaseRequest } from '../utils/auth-use-case-request'

interface GetRepositoryRequest extends AuthUseCaseRequest {
  id: string
}

type GetRepositoryResponse = {
  repository: Repository
}

export class GetRepositoryUseCase {
  async execute({
    id,
    sub,
    canAccess,
  }: GetRepositoryRequest): Promise<GetRepositoryResponse> {
    const repo = await prisma.repository.findUnique({
      where: {
        id,
      },
      include: {
        files: true,
      },
    })

    if (!repo) {
      throw ResourceNotFoundError
    }

    if (repo.accessPassword && (sub !== repo.id || !canAccess)) {
      throw UnauthorizedError
    }

    return {
      repository: repo,
    }
  }
}
