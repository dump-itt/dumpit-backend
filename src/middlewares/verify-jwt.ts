import { env } from '@/env'
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import jwt from 'jsonwebtoken'

export async function verifyJwt(
  request: FastifyRequest,
  reply: FastifyReply,
  next: HookHandlerDoneFunction,
) {
  try {
    const token = (
      request.headers.authorization as string | undefined
    )?.replace('Bearer ', '')

    if (!token) {
      request.repo = null
    } else {
      const { sub, canEdit, canAccess } = jwt.verify(token, env.JWT_SECRET) as {
        sub: string
        canEdit: boolean
        canAccess: boolean
      }

      request.repo = {
        sub,
        canAccess,
        canEdit,
      }
    }
  } catch (err) {
    console.log(err)
  }
}
