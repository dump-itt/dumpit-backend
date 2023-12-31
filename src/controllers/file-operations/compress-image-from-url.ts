import { env } from '@/env'
import { FastifyReply, FastifyRequest } from 'fastify'
import fetch from 'node-fetch'

export async function compressImageFromUrl(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { url } = req.body as any

  const res = await fetch('https://api.tinify.com/shrink', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${env.TINY_API_KEY}:`).toString(
        'base64',
      )}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: {
        url,
      },
    }),
  })

  const data = (await res.json()) as {
    output: {
      url: string
    }
  }

  return reply.status(200).send({ url: data.output.url })
}
