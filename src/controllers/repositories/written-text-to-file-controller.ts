import { WrittenTextToFileUseCase } from '@/use-cases/repositories/written-text-to-file';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function writtenTextToFileController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = req.params as any;
  const { text, fileName } = req.body as { text: string; fileName?: string };

  if (!text) {
    return reply.status(400).send({ message: 'Text content is required.' });
  }

  const useCase = new WrittenTextToFileUseCase();

  try {
    const { file } = await useCase.execute({ id, text, fileName });
    return reply.status(200).send({ file });
  } catch (error) {
    console.error('Error:', error);
    return reply.status(500).send({ message: 'Um erro ocorreu' });
  }
}
