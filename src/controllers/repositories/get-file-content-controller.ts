import { GetFileContentUseCase } from '@/use-cases/repositories/get-file-content'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getFileContentController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = req.params as any

  const useCase = new GetFileContentUseCase()

  const { file } = await useCase.execute({ id })

  return reply
    .status(200)
    .headers({ 'content-type': file.mimetype })
    .send(file.content)
}
