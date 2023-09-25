import { ResourceNotFoundError, UnauthorizedError } from '@/errors/AppError'
import { prisma } from '@/lib/prisma'
import { File as PrismaFile } from '@prisma/client'
import { randomUUID } from 'crypto'
import { File } from 'fastify-multer/lib/interfaces'
import fs from 'fs'
import { AuthUseCaseRequest } from '../utils/auth-use-case-request'

interface AddFileToRepositoryRequest extends AuthUseCaseRequest {
  id: string
  file: File
}

type AddFileToRepositoryResponse = {
  file: PrismaFile
}

export class AddFileToRepositoryUseCase {
  async execute({
    id,
    file,
    sub,
    canEdit,
  }: AddFileToRepositoryRequest): Promise<AddFileToRepositoryResponse> {
    const repo = await prisma.repository.findUnique({ where: { id } })

    if (!repo) {
      const path = `${process.cwd()}/uploads/repositories/${id}/${
        file.filename
      }`

      fs.unlinkSync(path)

      throw ResourceNotFoundError
    }

    if (repo.editPassword && (sub !== repo.id || !canEdit)) {
      const path = `${process.cwd()}/uploads/repositories/${id}/${
        file.filename
      }`

      fs.unlinkSync(path)

      throw UnauthorizedError
    }

    const dbFile = await prisma.file.create({
      data: {
        id: randomUUID(),
        name: file.filename ?? file.originalname,
        mimetype: file.mimetype,
        repositoryId: repo.id,
      },
    })

    return {
      file: dbFile,
    }
  }
}
