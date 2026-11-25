import { SortFn } from '@tanstack/react-table'
import {
  differenceInCalendarDays,
  format,
  formatDistanceStrict
} from 'date-fns'

import { Task, TaskHistoryDate } from '@/schemas/task-schema'
import { TasksTableFeatures } from '../components/tasks/tasks-table-features'
import { getNextDueDate, stringToDate } from './date-convert'

export function getTaskStatusLabels(
  repeatGoalEnabled: boolean,
  daysRepeat: number,
  history: TaskHistoryDate[]
) {
  const lastDate = history[0] ? stringToDate(history[0]) : null
  const nextDate = getNextDueDate(history, daysRepeat)
  const daysSince = lastDate
    ? differenceInCalendarDays(new Date(), lastDate)
    : 0
  const dueInDays = differenceInCalendarDays(nextDate, new Date())
  const taskIsLate = repeatGoalEnabled ? dueInDays < 0 : false

  let dateText, daysText

  if (repeatGoalEnabled && daysRepeat > 0) {
    dateText = `Next ${format(nextDate, 'dd MMM yyyy')}`

    const numDaysAbs = Math.abs(dueInDays)

    let numDaysText
    if (numDaysAbs === 1) {
      numDaysText = '1 day'
    } else if (numDaysAbs <= 45) {
      numDaysText = `${numDaysAbs} days`
    } else {
      numDaysText = formatDistanceStrict(nextDate, new Date())
    }

    if (dueInDays === 0) {
      daysText = 'due today'
    } else if (dueInDays > 0) {
      daysText = `due in ${numDaysText}`
    } else {
      daysText = `${numDaysText} late`
    }
  } else {
    dateText = lastDate
      ? `Last ${format(lastDate, 'dd MMM yyyy')}`
      : 'Never done'

    if (!lastDate) {
      daysText = 'n/a'
    } else if (daysSince === 0) {
      daysText = 'done today'
    } else if (daysSince === 1) {
      daysText = '1 day since'
    } else if (daysSince <= 45) {
      daysText = `${daysSince} days since`
    } else {
      daysText = `${formatDistanceStrict(new Date(), lastDate)} since`
    }
  }

  return { dateText, daysText, taskIsLate }
}

export const sortTaskStatusColumn: SortFn<TasksTableFeatures, Task> = (
  rowA,
  rowB,
  _columnId
) => {
  const today = new Date()

  if (rowA.original.repeatGoalEnabled !== rowB.original.repeatGoalEnabled) {
    return rowA.original.repeatGoalEnabled ? -1 : 1
  }

  if (rowA.original.repeatGoalEnabled) {
    const dateA = getNextDueDate(
      rowA.original.history,
      Number(rowA.original.daysRepeat)
    )
    const dateB = getNextDueDate(
      rowB.original.history,
      Number(rowB.original.daysRepeat)
    )
    return dateA.getTime() - dateB.getTime()
  }

  const lastDateA = rowA.original.history[0]
    ? stringToDate(rowA.original.history[0])
    : null
  const lastDateB = rowB.original.history[0]
    ? stringToDate(rowB.original.history[0])
    : null

  if (!lastDateA && !lastDateB) return 0
  if (!lastDateA) return 1
  if (!lastDateB) return -1

  return (
    differenceInCalendarDays(today, lastDateB) -
    differenceInCalendarDays(today, lastDateA)
  )
}
