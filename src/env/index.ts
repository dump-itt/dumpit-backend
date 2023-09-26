import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
  CLOUD_CONVERT_API_KEY: z.string(),
  TINY_API_KEY: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  throw new Error(
    `❌ Invalid environment variables\n
    ${JSON.stringify(_env.error.format())}`,
  )
}

export const env = _env.data
