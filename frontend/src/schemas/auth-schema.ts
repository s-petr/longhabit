import { z } from 'zod/v4'

import { pbTokenSchema } from './pb-schema'

export const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Invalid password')
})

export type LoginFields = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    email: z.email('Invalid email'),
    name: z.string().min(2, 'Too short'),
    password: z.string().min(8, 'Too short'),
    passwordConfirm: z.string()
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match',
    path: ['passwordConfirm']
  })

export type RegisterFields = z.infer<typeof registerSchema>

export const verifyEmailSchema = z.object({
  token: pbTokenSchema
})

export const verifyEmailParamsSchema = z.object({
  token: pbTokenSchema.catch('').optional()
})

export type VerifyEmailFields = z.infer<typeof verifyEmailSchema>

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email')
})
export type ForgotPasswordFields = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Too short'),
    passwordConfirm: z.string()
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match',
    path: ['passwordConfirm']
  })

export const resetPasswordParamsSchema = z.object({
  token: pbTokenSchema.catch('')
})

export type ResetPasswordFields = z.infer<typeof resetPasswordSchema>
