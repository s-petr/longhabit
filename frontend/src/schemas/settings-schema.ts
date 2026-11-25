import { z } from 'zod/v4'

import { pbIdSchema } from './pb-schema'

export const themeSchema = z.enum(['system', 'light', 'dark'])

export type Theme = z.infer<typeof themeSchema>

export const settingsSchema = z.object({
  id: pbIdSchema,
  remindEmail: z.email('Invalid email'),
  remindByEmailEnabled: z.coerce.boolean(),
  theme: themeSchema
})

export type Settings = z.infer<typeof settingsSchema>
