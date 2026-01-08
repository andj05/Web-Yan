import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string().min(32),
    PORT: z.string().default('3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    FRONTEND_URL: z.string().url(),
    N8N_WEBHOOK_URL: z.string().url(),
    RESEND_API_KEY: z.string(),
    FROM_EMAIL: z.string().email(),
    LINK_API_KEY: z.string().optional(),
    LINK_WEBHOOK_SECRET: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().default('us-east-1'),
    S3_BUCKET_NAME: z.string().optional(),
});

const env = envSchema.parse(process.env);

export default env;
