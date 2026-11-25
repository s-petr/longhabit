import * as React from 'react'

import { cn } from '@/lib/shadcn'

const Table = ({ className, ...props }: React.ComponentProps<'table'>) => (
  <div className='relative w-full overflow-auto'>
    <table
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
)
Table.displayName = 'Table'

const TableHeader = ({
  className,
  ...props
}: React.ComponentProps<'thead'>) => (
  <thead className={cn('[&_tr]:border-b', className)} {...props} />
)
TableHeader.displayName = 'TableHeader'

const TableBody = ({ className, ...props }: React.ComponentProps<'tbody'>) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
)
TableBody.displayName = 'TableBody'

const TableFooter = ({
  className,
  ...props
}: React.ComponentProps<'tfoot'>) => (
  <tfoot
    className={cn(
      'bg-muted/50 border-t font-medium last:[&>tr]:border-b-0',
      className
    )}
    {...props}
  />
)
TableFooter.displayName = 'TableFooter'

const TableRow = ({ className, ...props }: React.ComponentProps<'tr'>) => (
  <tr
    className={cn(
      'hover:bg-accent/25 data-[state=selected]:bg-muted border-b transition-colors',
      className
    )}
    {...props}
  />
)
TableRow.displayName = 'TableRow'

const TableHead = ({ className, ...props }: React.ComponentProps<'th'>) => (
  <th
    className={cn(
      'text-muted-foreground h-12 px-4 text-left align-middle font-medium has-[[role=checkbox]]:pr-0',
      className
    )}
    {...props}
  />
)
TableHead.displayName = 'TableHead'

const TableCell = ({ className, ...props }: React.ComponentProps<'td'>) => (
  <td
    className={cn('p-4 align-middle has-[[role=checkbox]]:pr-0', className)}
    {...props}
  />
)
TableCell.displayName = 'TableCell'

const TableCaption = ({
  className,
  ...props
}: React.ComponentProps<'caption'>) => (
  <caption
    className={cn('text-muted-foreground mt-4 text-sm', className)}
    {...props}
  />
)
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
}
