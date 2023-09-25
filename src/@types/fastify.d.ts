import 'fastify'
import { File } from 'fastify-multer/lib/interfaces'

declare module 'fastify' {
  export interface FastifyRequest {
    file?: File
    repo: null | {
      sub: string
      canEdit: boolean
      canAccess: boolean
    }
  }
}
