import { isValid, parse } from 'date-fns'
import { z } from 'zod/v4'

import { pbIdSchema } from './pb-schema'

export const taskHistoryDateSchema = z.string().refine((date) => {
  try {
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date())
    return isValid(parsedDate)
  } catch {
    return false
  }
}, 'Invalid date. Must use format yyyy-MM-dd')

export type TaskHistoryDate = z.infer<typeof taskHistoryDateSchema>

export const taskSchema = z.object({
  id: pbIdSchema.optional(),
  name: z.string().min(2, 'Too short'),
  description: z.string().optional(),
  category: z.string().optional(),
  repeatGoalEnabled: z.boolean().default(false),
  daysRepeat: z
    .union([
      z.literal(''),
      z.literal(0).transform(() => ''),
      z.coerce.number().int().min(1, 'Invalid number of days')
    ])
    .transform((val) => (val === '' ? 0 : val))
    .optional(),
  daysRemind: z
    .union([
      z.literal(''),
      z.literal(0).transform(() => ''),
      z.coerce.number().int().min(1, 'Invalid number of days')
    ])
    .transform((val) => (val === '' ? 0 : val))
    .optional(),
  remindByEmail: z.boolean().default(false),
  history: z.array(taskHistoryDateSchema)
})

export const taskListSchema = z.array(taskSchema)

export type Task = z.output<typeof taskSchema>

export const categoryListSchema = z.array(
  z.object({ category: z.string().optional() })
)

export type CategoryList = z.infer<typeof categoryListSchema>
