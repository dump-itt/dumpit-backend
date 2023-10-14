import './jobs'

import fastify from 'fastify'
import fastifyMulter from 'fastify-multer'
import fastifyCors from '@fastify/cors'
import CloudConvert from 'cloudconvert'

import { ZodError } from 'zod'
import { repositoryRoutes } from './controllers/repositories/routes'
import { multerDiskStorage } from './utils/multer-disk-storage'
import { AppError } from './errors/AppError'
import { fileOperationsRoute } from './controllers/file-operations/routes'

import { env } from './env'

export const app = fastify()

export const upload = fastifyMulter({
  storage: multerDiskStorage,
})

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyMulter.contentParser)
app.register(repositoryRoutes)
app.register(fileOperationsRoute)

export const cloudConvert = new CloudConvert(env.CLOUD_CONVERT_API_KEY)

app.setErrorHandler((error, _, reply) => {
  console.log(error)

  if (error instanceof AppError) {
    return reply.status(error.status).send({ message: error.message })
  }

  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
