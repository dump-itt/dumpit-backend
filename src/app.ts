import fastify from 'fastify'
import fastifyMulter from 'fastify-multer'
import fastifyCors from '@fastify/cors'

import { ZodError } from 'zod'
import { repositoryRoutes } from './controllers/repositories/routes'
import { multerDiskStorage } from './utils/multer-disk-storage'
import { AppError } from './errors/AppError'
import { fileOperationsRoute } from './controllers/file-operations/routes'
import CloudConvert from 'cloudconvert'

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

export const cloudConvert = new CloudConvert(
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNjJhNmY5NmViNDBhNjg3YzExYThjODRlMWRhN2YwOTZmYTYxN2IwY2JlM2VmNGU0MGJhMWQ2NzQ2MzIxNmVhNDllNmJjMWE0YWI4NWZmYzIiLCJpYXQiOjE2OTU3NTc3MTUuMDA5NzU0LCJuYmYiOjE2OTU3NTc3MTUuMDA5NzU2LCJleHAiOjQ4NTE0MzEzMTUuMDAzNDUzLCJzdWIiOiI2NTM3OTAzOSIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.Dh5mRx5_XeUCS0A6tC1sN39vgdFA7K8v4n54xiruQfFKKqHAhKRRA9ZEDPGZbfBaxqc8Wf5iuxe45KKe2cli49CFjNZ9Rjpb-eUK99on2k3mLl52uYCRXOI7Ez-vTGP4j7rN8U9_FW6iOSsfhtJUdtvbRSA4fgfN8mbpbxNMzkQ9InCRZGUgqJQuo2HnIjQQkEbjw5HY2SBLl6BIjMtdYXpgL4keQ9JNvf1_NKzibnlZgbkDbPtY2QCEUO2qsiMl3D-R3Xtc9VOuvIShjEbQ6cJubrASqSmJRF2PlhiVnKQ0fzNY-VTay0F6QOBwdbecU9eHtYRxdSL3QoUdIEadjtOWz-hb4byShOCw5uoOY1clrbO8MjNovUBQnQbYU6wk4ZIck5yj6Jh-AiFU4srxdF5vYJanu9R6bOOmgbz52iVzPQe9cCa571QGVxN1_uIW0bZbR-fcKLfuTHgujtudbkk25KX4rWONSLA4tgkZ4tH6XqfFkZtmLZIlU0VAI2LVj1dFjYBLnQyIQlvCzDXir2YYFFnu9JVCwsXWZjIHjX3Nv1rzc4YblaQ7b7tRJoC1DcEUVIG5ht1nfilunboEAKB6dbuKSCaUz7koEHudaBD8nSlNTAQTV___QYH0HzQK9gGRDrTfsuG7BNmPkfw1hlvTdjP6fOBsGBVIQCdUoa0',
)

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
