import { Outlet, useNavigate } from '@tanstack/react-router'
import { Suspense } from 'react'

import Spinner from '@/components/shared/spinner'
import { TasksTable } from '@/components/tasks/tasks-table'
import { Sheet } from '@/components/ui/sheet'
import useTasks from '@/hooks/use-tasks'

export default function TasksPage() {
  const { tasks } = useTasks()
  const navigate = useNavigate()

  return (
    <main className='flex flex-col gap-8 text-justify text-lg'>
      <TasksTable tasks={tasks} />
      <Sheet open={true} onOpenChange={() => navigate({ to: '/tasks' })}>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </Sheet>
    </main>
  )
}
