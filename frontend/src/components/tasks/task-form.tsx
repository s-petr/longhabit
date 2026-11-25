import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Resolver, useForm, useWatch } from 'react-hook-form'

import AutoCompleteField from '@/components/form/autocomplete-field'
import InputField from '@/components/form/input-field'
import SwitchField from '@/components/form/switch-field'
import TextAreaField from '@/components/form/text-area-field'
import { DatePicker } from '@/components/tasks/date-picker'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import useAuth from '@/hooks/use-auth'
import useSettings from '@/hooks/use-settings'
import useTasks from '@/hooks/use-tasks'
import { cn } from '@/lib/shadcn'
import { Task, taskSchema } from '@/schemas/task-schema'

export default function TaskForm({
  selectedTask
}: {
  selectedTask?: Task | null | undefined
}) {
  const navigate = useNavigate()
  const { createTask, updateTask, deleteTask } = useTasks()
  const { user } = useAuth()

  const { remindByEmailEnabled } = useSettings()
  const { categories } = useTasks()

  const form = useForm<Task>({
    resolver: zodResolver(taskSchema) as Resolver<Task>,
    defaultValues: {
      name: selectedTask ? selectedTask.name : '',
      description: selectedTask ? selectedTask.description : '',
      category: selectedTask ? selectedTask.category : '',
      repeatGoalEnabled: selectedTask ? selectedTask.repeatGoalEnabled : false,
      daysRepeat: selectedTask?.daysRepeat || '',
      daysRemind: selectedTask?.daysRemind || '',
      remindByEmail: selectedTask ? selectedTask.remindByEmail : false,
      history: selectedTask ? selectedTask.history : []
    }
  })

  const fieldsEdited = form.formState.isDirty
  const [repeatGoalEnabled, remindByEmail] = useWatch({
    control: form.control,
    name: ['repeatGoalEnabled', 'remindByEmail']
  })

  function onSubmit(values: Task) {
    if (!fieldsEdited) {
      navigate({ to: '/tasks' })
      return
    }

    if (selectedTask) {
      selectedTask.id && updateTask(selectedTask.id, values)
    } else {
      user && createTask(user.id, values)
    }
  }

  const pageTitle = `${selectedTask ? 'Edit' : 'New'} Task`

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-y-4'
        onSubmit={form.handleSubmit(onSubmit)}>
        <SheetHeader>
          <SheetTitle className='pb-4 text-4xl font-bold'>
            {pageTitle}
          </SheetTitle>
          <SheetDescription className='hidden'>{pageTitle}</SheetDescription>
        </SheetHeader>

        <InputField form={form} name='name' />

        <AutoCompleteField form={form} name='category' options={categories} />

        <TextAreaField form={form} name='description' />

        <SwitchField
          form={form}
          name='repeatGoalEnabled'
          label='Set a goal to repeat regularly'
        />

        <InputField
          form={form}
          type='number'
          name='daysRepeat'
          label='Repeat every x days'
          min={1}
          disabled={!repeatGoalEnabled}
        />

        <SwitchField
          form={form}
          name='remindByEmail'
          label='Send reminders by email'
          hidden={!remindByEmailEnabled}
          disabled={!remindByEmailEnabled || !repeatGoalEnabled}
        />

        <InputField
          form={form}
          type='number'
          name='daysRemind'
          label='Remind every x days'
          min={1}
          hidden={!remindByEmailEnabled}
          disabled={
            !remindByEmailEnabled || !repeatGoalEnabled || !remindByEmail
          }
        />

        <FormField
          control={form.control}
          name='history'
          render={({ field }) => (
            <FormItem className='w-full pb-4'>
              <FormLabel className='w-full text-center'>
                Dates completed
              </FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter className='mt-4 grid w-full grid-cols-2 gap-4 px-0 sm:space-x-0'>
          <Button
            type='submit'
            disabled={!fieldsEdited}
            className={cn('w-full', !selectedTask && 'col-span-2')}>
            {selectedTask ? 'Update Task' : 'Add Task'}
          </Button>
          {selectedTask && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='destructive' type='button' className='w-full'>
                  Delete Task
                </Button>
              </DialogTrigger>
              <DialogContent
                className='bg-popover sm:max-w-75'
                onKeyDown={(event) =>
                  event.key === 'Enter' && deleteTask(selectedTask)
                }>
                <DialogHeader>
                  <DialogTitle>Delete Task</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the task &quot;
                    {selectedTask.name}&quot;?
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className='flex items-center gap-4 sm:justify-between'>
                  <Button
                    className='w-full'
                    variant='destructive'
                    onClick={() => deleteTask(selectedTask)}>
                    Delete
                  </Button>
                  <DialogClose asChild>
                    <Button
                      type='button'
                      className='w-full'
                      variant='secondary'>
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Button
            asChild
            variant='secondary'
            type='button'
            className='col-span-2 w-full'>
            <Link to='/tasks' preload={false}>
              {selectedTask ? 'Back' : 'Cancel'}
            </Link>
          </Button>
        </SheetFooter>
      </form>
    </Form>
  )
}
