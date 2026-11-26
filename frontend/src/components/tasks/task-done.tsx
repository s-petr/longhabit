import { CheckCircledIcon } from '@radix-ui/react-icons'

import useTasks from '@/hooks/use-tasks'
import { dateToString } from '@/lib/date-convert'
import { cn } from '@/lib/shadcn'
import { Task } from '@/schemas/task-schema'

export function TaskDone({ task }: { task: Task }) {
  const today = dateToString()
  const doneToday = task.history?.includes(today)

  const { updateTaskHistory } = useTasks()

  const handleCheck = () => {
    const history = task.history || []
    const updatedHistory = doneToday
      ? history.filter((date) => date !== today)
      : [...new Set([today, ...history])]

    updateTaskHistory(task.id!, updatedHistory)
  }

  return (
    <button
      type='button'
      aria-label={`Completed today: ${task.name}`}
      aria-pressed={doneToday}
      className={cn(
        'relative z-10 flex size-8 cursor-pointer items-center justify-center rounded-full transition-all duration-75 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 outline-ring',
        doneToday
          ? 'bg-primary hover:bg-primary/90'
          : 'bg-secondary/75 hover:bg-secondary'
      )}
      onClick={handleCheck}>
      {doneToday && (
        <CheckCircledIcon className='text-primary-foreground size-5' />
      )}
    </button>
  )
}

//