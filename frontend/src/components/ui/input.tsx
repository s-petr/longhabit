import * as React from 'react'

import { cn } from '@/lib/shadcn'

const Input = ({
  className,
  type,
  ref,
  ...props
}: React.ComponentProps<'input'>) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring/50 flex h-9 w-full rounded-md border px-2 py-2 text-sm font-light file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:outline-hidden disabled:opacity-50',
      className
    )}
    {...props}
  />
)
Input.displayName = 'Input'

export { Input }
