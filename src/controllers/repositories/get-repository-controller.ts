import { GetRepositoryUseCase } from '@/use-cases/repositories/get-repository'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getRepositoryController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = req.params as any

  const useCase = new GetRepositoryUseCase()

  const { repository } = await useCase.execute({ id })

  return reply.status(200).send(repository)
}
