import { FastifyInstance } from 'fastify'
import { createRepositoryController } from './create-repository-controller'
import { deleteRepositoryController } from './delete-repository-controller'
import { upload } from '@/app'
import { addFileToRepositoryController } from './add-file-to-repository-controller'
import { getRepositoryController } from './get-repository-controller'
import { getFileContentController } from './get-file-content-controller'
import { deleteFileController } from './delete-file-controller'
import { authenticateAccessRepositoryController } from './authenticate-access-repository-controllers'
import { authenticateEditRepositoryController } from './authenticate-edit-repository-controllers'
import { writtenTextToFileController } from './written-text-to-file-controller'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function repositoryRoutes(app: FastifyInstance) {
  app.post('/repositories', createRepositoryController)
  app.post('/authenticate-access', authenticateAccessRepositoryController)
  app.post('/authenticate-edit', authenticateEditRepositoryController)
  app.get(
    '/repositories/:id',
    { preHandler: [verifyJwt] },
    getRepositoryController,
  )
  app.delete(
    '/repositories/:id',
    { onRequest: [verifyJwt] },
    deleteRepositoryController,
  )
  app.get('/files/:id', getFileContentController)
  app.delete('/files/:id', { onRequest: [verifyJwt] }, deleteFileController)
  app.route({
    method: 'POST',
    url: '/repositories/:id/add',
    preHandler: upload.single('file'),
    handler: addFileToRepositoryController,
    onRequest: [verifyJwt],
  })
  app.route({
    method: 'POST',
    url: '/repositories/:id/write',
    handler: writtenTextToFileController,
  })
}
