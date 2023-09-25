import { DeleteRepositoryUseCase } from '@/use-cases/repositories/delete-repository'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteRepositoryController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = req.params as any

  const useCase = new DeleteRepositoryUseCase()

  await useCase.execute({
    id,
    sub: req.repo?.sub,
    canAccess: req.repo?.canAccess,
    canEdit: req.repo?.canEdit,
  })

  return reply.status(204).send()
}
