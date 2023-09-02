import { DeleteFileUseCase } from '@/use-cases/repositories/delete-file'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteFileController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = req.params as any

  const useCase = new DeleteFileUseCase()

  await useCase.execute({ id })

  return reply.status(204).send()
}
