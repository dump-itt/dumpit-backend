import { FastifyInstance } from 'fastify'
import { compressImageFromUrl } from './compress-image-from-url'
import { transformDocxToPdf } from './transform-docx-to-pdf'

export async function fileOperationsRoute(app: FastifyInstance) {
  app.post('/images/compress', compressImageFromUrl)
  app.post('/transform/docx-to-pdf', transformDocxToPdf)
}
