import { ResourceNotFoundError } from '@/errors/AppError'
import { prisma } from '@/lib/prisma'
import { File as PrismaFile } from '@prisma/client'
import { randomUUID } from 'crypto'
import { File } from 'fastify-multer/lib/interfaces'
import fs from 'fs'

type AddFileToRepositoryRequest = {
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
  }: AddFileToRepositoryRequest): Promise<AddFileToRepositoryResponse> {
    const repo = await prisma.repository.findUnique({ where: { id } })

    if (!repo) {
      const path = `${process.cwd()}/uploads/repositories/${id}/${
        file.filename
      }`

      fs.unlinkSync(path)

      throw ResourceNotFoundError
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
