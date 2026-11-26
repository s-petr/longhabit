import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useRef } from 'react'

import TaskForm from '@/components/tasks/task-form'
import { SheetContent } from '@/components/ui/sheet'
import { taskSchema } from '@/schemas/task-schema'
import { taskQueryOptions } from '@/services/api-tasks'

export default function EditTaskPage() {
  const { taskId } = useParams({ from: '/tasks/$taskId' })
  const opener = useRef<Element | null>(null)

  const { data, isLoading } = useSuspenseQuery(taskQueryOptions(taskId))
  const task = taskSchema.parse(data)

  return (
    !isLoading && (
      <SheetContent
        onOpenAutoFocus={(event) => {
          opener.current = document.activeElement

          const sheet = event.target
          if (!(sheet instanceof HTMLElement)) return
          const nameInput =
            sheet.querySelector<HTMLInputElement>('input[name="name"]')
          if (!nameInput) return

          event.preventDefault()
          nameInput.focus({ preventScroll: true })
          const end = nameInput.value.length
          nameInput.setSelectionRange(end, end)
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          if (opener.current instanceof HTMLElement) opener.current.focus()
        }}>
        <TaskForm selectedTask={task} />
      </SheetContent>
    )
  )
}
