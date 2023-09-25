import { GetRepositoryUseCase } from '@/use-cases/repositories/get-repository'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getRepositoryController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = req.params as any

  const useCase = new GetRepositoryUseCase()

  console.log(req.repo)

  const { repository } = await useCase.execute({
    id,
    sub: req.repo?.sub,
    canAccess: req.repo?.canAccess,
    canEdit: req.repo?.canEdit,
  })

  return reply.status(200).send(repository)
}
