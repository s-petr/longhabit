import {
  TasksTableFeatures,
  tasksTableFeatures
} from '@/components/tasks/tasks-table-features'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/shadcn'
import { getTaskStatusLabels, sortTaskStatusColumn } from '@/lib/task-status'
import { CaretSortIcon, PlusIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import {
  createColumnHelper,
  SortingState,
  useTable
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { Task } from '../../schemas/task-schema'
import TaskColumnDisplay from './task-column'
import { TaskDone } from './task-done'

const columnHelper = createColumnHelper<TasksTableFeatures, Task>()

export function TasksTable({ tasks }: { tasks: Task[] }) {
  tasks ??= []
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const navigate = useNavigate()

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: 'done',
          header: () => '',
          cell: ({ row }) => {
            return <TaskDone task={row.original} />
          }
        }),
        columnHelper.accessor('name', {
          header: ({ column }) => {
            return (
              <Button
                variant='ghost'
                className='-ml-9 gap-x-0 pl-0 text-sm hover:bg-transparent'
                onClick={column.getToggleSortingHandler()}>
                <CaretSortIcon />
                Task / Goal
              </Button>
            )
          },
          cell: ({ row }) => <TaskColumnDisplay row={row} />
        }),
        columnHelper.accessor('history', {
          header: ({ column }) => {
            return (
              <div className='flex w-full justify-end'>
                <Button
                  variant='ghost'
                  className='gap-x-0 pr-0 text-sm hover:bg-transparent'
                  onClick={column.getToggleSortingHandler()}>
                  Status
                  <CaretSortIcon />
                </Button>
              </div>
            )
          },
          cell: ({ row }) => {
            const { dateText, daysText, taskIsLate } = getTaskStatusLabels(
              row.original.repeatGoalEnabled,
              Number(row.original.daysRepeat),
              row.original.history
            )

            return (
              <div className='text-right'>
                <p className='text-muted-foreground text-sm font-light whitespace-nowrap'>
                  {dateText}
                </p>
                <p
                  className={cn(
                    'text-xs',
                    taskIsLate ? 'text-destructive' : ''
                  )}>
                  {daysText}
                </p>
              </div>
            )
          },
          sortFn: sortTaskStatusColumn
        })
      ]),
    []
  )

  const table = useTable({
    features: tasksTableFeatures,
    data: tasks,
    columns,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      globalFilter: categoryFilter
    },
    globalFilterFn: (row, _, filterValue) => {
      if (!filterValue || filterValue === 'All') return true
      return row.original.category === filterValue
    }
  })

  const categories = [
    ...new Set(
      tasks.map((task) => task.category).filter((category) => category)
    )
  ]

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between py-2'>
        <Input
          placeholder='Filter tasks...'
          className='rounded-r-none focus-visible:ring-0'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          onKeyDown={(event) =>
            event.key === 'Escape' &&
            table.getColumn('name')?.setFilterValue('')
          }
        />
        <Select
          value={categoryFilter ?? 'All'}
          onValueChange={setCategoryFilter}>
          <SelectTrigger
            aria-label='Filter by category'
            className='w-32 cursor-pointer rounded-l-none border-l-0 select-none focus:ring-0 focus-visible:ring-0'
            onKeyDown={(event) =>
              event.key === 'Escape' && setCategoryFilter('All')
            }>
            <SelectValue placeholder='Filter category' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='All' className='cursor-pointer'>
                All
              </SelectItem>
              {categories.map((category, index) => (
                <SelectItem
                  key={`${category}-${index}`}
                  value={category!}
                  className='cursor-pointer'>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className='ml-2 size-8 rounded-full'
          aria-label='Add new task'
          onClick={() => navigate({ to: '/tasks/new' })}>
          <PlusIcon />
        </Button>
      </div>
      <div className='space-y-4'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className='border-none hover:bg-inherit'>
                {headerGroup.headers.map((header, columnIndex) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'px-0',
                        columnIndex === 0 ? 'w-9' : 'w-fit'
                      )}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className='hover:bg-popover/50 cursor-pointer border-none'
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => navigate({ to: `/tasks/${row.original.id}` })}>
                  {row.getVisibleCells().map((cell, index, array) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'px-1 py-1',
                        index === 0 && 'rounded-l-md',
                        index === array.length - 1 && 'rounded-r-md'
                      )}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-8 text-center'>
                  {tasks.length ? 'No results.' : 'No tasks added yet.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
