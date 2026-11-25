import { z } from 'zod/v4'

import { pbIdSchema } from './pb-schema'
import { settingsSchema, themeSchema } from './settings-schema'

export const userSchema = z.object({
  id: pbIdSchema,
  avatar: z.string(),
  email: z.email('Invalid email'),
  name: z.string().min(2, 'Too short').optional().or(z.literal('')),
  verified: z.boolean(),
  authWithPasswordAvailable: z.boolean()
})

export type User = z.infer<typeof userSchema>

export const userWithSettingsSchema = userSchema.extend({
  authWithPasswordAvailable: z.boolean(),
  settings: settingsSchema
})

export type UserWithSettings = z.infer<typeof userWithSettingsSchema>

export const updateUserSettingsSchema = z
  .object({
    remindEmail: z.email('Invalid email'),
    remindByEmailEnabled: z.boolean(),
    avatar: z.instanceof(File).nullish().optional(),
    name: z.string().min(2, 'Too short').optional().or(z.literal('')),
    theme: themeSchema,
    oldPassword: z.string().optional(),
    password: z.string().optional(),
    passwordConfirm: z.string().optional()
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords must match',
    path: ['passwordConfirm']
  })
  .refine(
    (data) =>
      (data.oldPassword === '' && data.password === '') ||
      data.oldPassword !== data.password,
    {
      message: 'New password is the same',
      path: ['password']
    }
  )
  .refine(
    (data) => {
      const anyPasswordFieldNotEmpty =
        data.oldPassword || data.password || data.passwordConfirm
      const allPasswordFieldsFilled =
        data.oldPassword && data.password && data.passwordConfirm
      return !anyPasswordFieldNotEmpty || allPasswordFieldsFilled
    },
    {
      message: 'Complete all password fields',
      path: ['password']
    }
  )

export type UpdateUserSettingsFields = z.infer<typeof updateUserSettingsSchema>
