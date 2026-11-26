import { addDays, format, isValid, parse } from 'date-fns'

import {
  taskHistoryDateFormat,
  taskHistoryDateSchema
} from '@/schemas/task-schema'

export function stringToDate(dateString: string) {
  return parse(
    taskHistoryDateSchema.parse(dateString),
    taskHistoryDateFormat,
    new Date()
  )
}

export function dateToString(date: Date = new Date()) {
  if (!(date instanceof Date) || !isValid(date))
    throw new Error('Invalid Date object provided')

  return format(date, taskHistoryDateFormat)
}

export function getNextDueDate(history: string[], daysRepeat: number) {
  const lastCompleteDate = history?.length
    ? stringToDate(history[0])
    : new Date()

  return addDays(lastCompleteDate, daysRepeat)
}
