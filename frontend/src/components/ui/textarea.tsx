import * as React from 'react'

import { cn } from '@/lib/shadcn'

const Textarea = ({
  className,
  ref,
  ...props
}: React.ComponentProps<'textarea'>) => (
  <textarea
    ref={ref}
    className={cn(
      'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-2 py-2 text-sm font-light focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-hidden disabled:opacity-50 md:text-sm',
      className
    )}
    {...props}
  />
)
Textarea.displayName = 'Textarea'

export { Textarea }
