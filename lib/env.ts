import { z } from 'zod'

const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),

    // MercadoPago
    MERCADOPAGO_ACCESS_TOKEN: z.string().min(1, "MERCADOPAGO_ACCESS_TOKEN is required"),
    MERCADOPAGO_WEBHOOK_SECRET: z.string().optional(), // Optional for now to avoid breaking build if not set
    NEXT_PUBLIC_BASE_URL: z.string().url().optional().default("http://localhost:3000"),

    // Optional Services
    RESEND_API_KEY: z.string().optional(),
    FORMSPREE_FORM_ID: z.string().optional(),

    // YouTube
    YOUTUBE_API_KEY: z.string().optional(),
    PASTOR_CHANNEL_ID: z.string().optional(),

    // Admin
    ADMIN_TOKEN: z.string().optional(),

    // Node Environment
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
})

export const env = envSchema.parse(process.env)
