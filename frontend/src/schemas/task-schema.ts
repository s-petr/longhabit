import { isValid, parse } from 'date-fns'
import { z } from 'zod'
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
  daysRepeat: z.coerce.number().int().min(1, 'Invalid number of days'),
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

export type Task = z.infer<typeof taskSchema>
