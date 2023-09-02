import { FastifyInstance } from 'fastify'
import { createRepositoryController } from './create-repository-controller'
import { deleteRepositoryController } from './delete-repository-controller'
import { upload } from '@/app'
import { addFileToRepositoryController } from './add-file-to-repository-controller'
import { getRepositoryController } from './get-repository-controller'
import { getFileContentController } from './get-file-content-controller'
import { deleteFileController } from './delete-file-controller'

export async function repositoryRoutes(app: FastifyInstance) {
  app.post('/repositories', createRepositoryController)
  app.get('/repositories/:id', getRepositoryController)
  app.delete('/repositories/:id', deleteRepositoryController)
  app.get('/files/:id', getFileContentController)
  app.delete('/files/:id', deleteFileController)
  app.route({
    method: 'POST',
    url: '/repositories/:id/add',
    preHandler: upload.single('file'),
    handler: addFileToRepositoryController,
  })
}
