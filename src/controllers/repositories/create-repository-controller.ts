import { CreateRepositoryUseCase } from "@/use-cases/repositories/create-repository";
import { FastifyReply, FastifyRequest } from "fastify";

export async function createRepositoryController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { accessPassword, editPassword } = req.body as any;

    const useCase = new CreateRepositoryUseCase();

    const { repository } = await useCase.execute({
      accessPassword,
      editPassword,
    });

    return reply.status(200).send(repository);
  } catch (error) {
    return reply.status(500).send("Erro ao criar repositório");
  }
}
