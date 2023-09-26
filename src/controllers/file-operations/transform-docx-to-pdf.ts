import { cloudConvert } from '@/app'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function transformDocxToPdf(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { url } = req.body as any

  const job = await cloudConvert.jobs.create({
    tasks: {
      'import-my-file': {
        operation: 'import/url',
        url: `${url}.docx`,
      },
      'convert-my-file': {
        operation: 'convert',
        input: 'import-my-file',
        output_format: 'pdf',
      },
      'export-my-file': {
        operation: 'export/url',
        input: 'convert-my-file',
      },
    },
  })

  const jobRes = await cloudConvert.jobs.wait(job.id) // Wait for job completion

  console.log(jobRes)

  const file = cloudConvert.jobs.getExportUrls(jobRes)[0]

  console.log(file)

  return reply.status(200).send({ url: null })
}
