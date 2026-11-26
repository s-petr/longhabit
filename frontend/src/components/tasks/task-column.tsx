import { EnvelopeClosedIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'

import { TasksTableFeatures } from '@/components/tasks/tasks-table-features'
import useAuth from '@/hooks/use-auth'
import { cn } from '@/lib/shadcn'
import { Task } from '@/schemas/task-schema'

export default function TaskColumnDisplay({
  row
}: {
  row: Row<TasksTableFeatures, Task>
}) {
  const { user } = useAuth()
  const globalRemindByEmailEnabled = !!user?.settings?.remindByEmailEnabled
  const daysRepeat = Number(row.original.daysRepeat)
  const repeatGoalEnabled = daysRepeat > 0 && row.original.repeatGoalEnabled
  const remindByEmail = row.original.remindByEmail
  const willSendEmailReminder =
    globalRemindByEmailEnabled && repeatGoalEnabled && remindByEmail
  const taskName: string = row.getValue('name')

  return (
    <div>
      <p className='text-muted-foreground text-left text-sm font-light'>
        {row.original.id ? (
          <Link
            to='/tasks/$taskId'
            params={{ taskId: row.original.id }}
            className='focus-visible:outline-ring rounded-sm underline-offset-2 after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2'>
            {taskName}
          </Link>
        ) : (
          taskName
        )}
      </p>
      <p
        className={cn(
          'flex items-center gap-1 text-xs',
          !repeatGoalEnabled && 'text-muted-foreground'
        )}>
        {repeatGoalEnabled
          ? `every ${daysRepeat} day${daysRepeat === 1 ? '' : 's'}`
          : 'no goal'}
        {willSendEmailReminder && (
          <EnvelopeClosedIcon className='text-muted-foreground size-2.5' />
        )}
      </p>
    </div>
  )
}
