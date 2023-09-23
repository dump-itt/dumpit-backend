import { AuthenticateAccessRepositoryUseCase } from "@/use-cases/repositories/authenticate-access-repo";
import { FastifyRequest, FastifyReply } from "fastify";

export async function authenticateAccessRepositoryController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id, password } = req.body as any;
    const useCase = new AuthenticateAccessRepositoryUseCase();

    const { isAuthenticate } = await useCase.execute({
      id,
      password,
    });

    if (isAuthenticate) {
      return reply.status(200).send("Autenticação bem-sucedida");
    } else {
      return reply.status(401).send("Autenticação falhou");
    }
  } catch (error) {
    return reply.status(500).send("Erro na autenticação");
  }
}
