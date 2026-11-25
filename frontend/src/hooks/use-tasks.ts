import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { usePlausible } from '@/context/plausible-context'
import { errorToast, successToast } from '@/lib/toast'
import { Task } from '@/schemas/task-schema'
import {
  createTask as createTaskApi,
  deleteTask as deleteTaskApi,
  getCategoryList,
  tasksQueryOptions,
  updateTask as updateTaskApi,
  updateTaskHistory as updateTaskHistoryApi
} from '@/services/api-tasks'

export default function useTasks() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { trackEvent } = usePlausible()
  const { data: tasks } = useSuspenseQuery(tasksQueryOptions)

  const { data: categories } = useSuspenseQuery({
    queryKey: ['categories'],
    queryFn: () => {
      const cachedTasks = queryClient.getQueryData<Task[]>(['tasks'])

      if (cachedTasks) {
        const categories = cachedTasks
          .map((task) => task.category)
          .filter((category): category is string => !!category)
        return [...new Set(categories)]
      }
      return getCategoryList()
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchInterval: false
  })

  const createMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Task }) =>
      createTaskApi(userId, data),

    onSuccess: (_, context) => {
      trackEvent('task-add')
      successToast(
        'New task added',
        `A new task "${context.data.name}" was created.`
      )
      navigate({ to: '/tasks' })
    },

    onError: (error) => {
      console.error(error)
      errorToast('Could not create a new task', error)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const createTask = (userId: string, taskData: Task) =>
    createMutation.mutate({ userId, data: taskData })

  const updateMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Task }) =>
      updateTaskApi(taskId, data),

    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
      const previousTask = queryClient.getQueryData<Task[]>(['tasks', taskId])

      queryClient.setQueryData(['tasks'], (currentTasks: Task[]) => {
        return currentTasks.map((currentTask: Task) =>
          taskId === currentTask.id ? { ...currentTask, ...data } : currentTask
        )
      })

      queryClient.setQueryData(
        ['tasks', taskId],
        (currentTask: Task[] | undefined) => ({ ...currentTask, ...data })
      )

      return { previousTasks, previousTask }
    },

    onSuccess: (_, context) => {
      successToast(
        'Updated task',
        `Updated details for task "${context.data.name}".`
      )
      navigate({ to: '/tasks' })
    },

    onError: (error, variables, context) => {
      console.error(error)
      errorToast('Could not update task', error)
      queryClient.setQueryData(['tasks'], context?.previousTasks)
      queryClient.setQueryData(
        ['tasks', variables.taskId],
        context?.previousTask
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const updateTask = (taskId: string, taskData: Task) =>
    updateMutation.mutate({ taskId, data: taskData })

  const updateHistoryMutation = useMutation({
    mutationFn: ({
      taskId,
      taskHistory
    }: {
      taskId: string
      taskHistory: string[]
    }) => updateTaskHistoryApi(taskId, taskHistory),

    onMutate: async ({ taskId, taskHistory }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
      const previousTask = queryClient.getQueryData<Task[]>(['tasks', taskId])

      queryClient.setQueryData(['tasks'], (currentTasks: Task[] | undefined) =>
        currentTasks
          ? currentTasks.map((currentTask) =>
              currentTask.id === taskId
                ? { ...currentTask, history: taskHistory }
                : currentTask
            )
          : []
      )

      previousTask &&
        queryClient.setQueryData(
          ['tasks', taskId],
          (currentTask: Task[] | undefined) => ({
            ...currentTask,
            history: taskHistory
          })
        )

      return { previousTasks, previousTask }
    },

    onError: (error, variables, context) => {
      console.error(error)
      errorToast('Could not update task history', error)
      queryClient.setQueryData(['tasks'], context?.previousTasks)
      queryClient.setQueryData(
        ['tasks', variables.taskId],
        context?.previousTask
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const updateTaskHistory = (taskId: string, taskHistory: string[]) =>
    updateHistoryMutation.mutate({ taskId, taskHistory })

  const deleteMutation = useMutation({
    mutationFn: (taskData: Task) => deleteTaskApi(taskData.id!),

    onSuccess: (_, context) => {
      successToast('Deleted task', `Task "${context.name}" was deleted.`)
      navigate({ to: '/tasks' })
    },

    onError: (error) => {
      console.error(error)
      errorToast('Could not delete task', error)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const deleteTask = (taskData: Task) => deleteMutation.mutate(taskData)

  return {
    tasks,
    categories,
    createTask,
    updateTask,
    updateTaskHistory,
    deleteTask
  }
}
