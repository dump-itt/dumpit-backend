import fastifyMulter from 'fastify-multer'
import fs from 'fs'

export const multerDiskStorage = fastifyMulter.diskStorage({
  destination: function (req, file, cb) {
    const { id: repositoryId } = req.params as any

    const path = `${process.cwd()}/uploads/repositories/${repositoryId}`

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true })
    }

    cb(null, path)
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.').pop()
    const filenameWithoutExtension = file.originalname.replace(
      `.${fileExtension}`,
      '',
    )
    const filename = `${filenameWithoutExtension}-${Date.now()}.${fileExtension}`
    cb(null, filename)
  },
})
