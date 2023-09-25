import { env } from '@/env'
import { AuthenticateEditRepositoryUseCase } from '@/use-cases/repositories/authenticate-edit-repo'
import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

export async function authenticateEditRepositoryController(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { id, password } = req.body as any
    const useCase = new AuthenticateEditRepositoryUseCase()

    const { isAuthenticate } = await useCase.execute({
      id,
      password,
    })

    if (isAuthenticate) {
      const token = jwt.sign(
        {
          sub: id,
          canAccess: true,
          canEdit: true,
        },
        env.JWT_SECRET,
      )

      return reply.status(200).send({ token })
    } else {
      return reply.status(401).send('Autenticação falhou')
    }
  } catch (error) {
    return reply.status(500).send('Erro na autenticação')
  }
}
