import { AddFileToRepositoryUseCase } from '@/use-cases/repositories/add-file-to-repository'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function addFileToRepositoryController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = req.params as any
  const { file } = req

  if (!file) throw new Error()

  const useCase = new AddFileToRepositoryUseCase()

  console.log(req.repo)

  const { file: _file } = await useCase.execute({
    id,
    file,
    sub: req.repo?.sub,
    canAccess: req.repo?.canAccess,
    canEdit: req.repo?.canEdit,
  })

  return reply.status(200).send({ file: _file })
}
