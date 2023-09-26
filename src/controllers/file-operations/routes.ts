import { FastifyInstance } from 'fastify'
import { compressImageFromUrl } from './compress-image-from-url'

export async function fileOperationsRoute(app: FastifyInstance) {
  app.post('/images/compress', compressImageFromUrl)
}
