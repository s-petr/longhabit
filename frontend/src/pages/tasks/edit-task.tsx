import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'

import TaskForm from '@/components/tasks/task-form'
import { SheetContent } from '@/components/ui/sheet'
import { taskSchema } from '@/schemas/task-schema'
import { taskQueryOptions } from '@/services/api-tasks'

export default function EditTaskPage() {
  const { taskId } = useParams({ from: '/tasks/$taskId' })

  const { data, isLoading } = useSuspenseQuery(taskQueryOptions(taskId))
  const task = taskSchema.parse(data)

  return (
    !isLoading && (
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <TaskForm selectedTask={task} />
      </SheetContent>
    )
  )
}
