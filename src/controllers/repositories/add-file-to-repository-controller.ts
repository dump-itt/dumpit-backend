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

  const { file: _file } = await useCase.execute({ id, file })

  return reply.status(200).send({ file: _file })
}
