import { CreateRepositoryUseCase } from '@/use-cases/repositories/create-repository'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function createRepositoryController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = new CreateRepositoryUseCase()

  const { repository } = await useCase.execute()

  return reply.status(200).send(repository)
}
