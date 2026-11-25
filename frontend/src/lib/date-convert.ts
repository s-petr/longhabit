import { addDays, format, isValid } from 'date-fns'

import { taskHistoryDateSchema } from '@/schemas/task-schema'

export function stringToDate(dateString: string) {
  const parsedDateString = taskHistoryDateSchema.parse(dateString)
  const date = new Date(parsedDateString)
  return date
}

export function dateToString(date: Date = new Date()) {
  if (!(date instanceof Date) || !isValid(date))
    throw new Error('Invalid Date object provided')

  return format(date, 'yyyy-MM-dd')
}

export function getNextDueDate(history: string[], daysRepeat: number) {
  const lastCompleteDate = history?.length
    ? stringToDate(history[0])
    : new Date()

  return addDays(lastCompleteDate, daysRepeat)
}
