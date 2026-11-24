import { cn } from '@/lib/shadcn'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const labelVariants = cva(
  'select-none text-sm leading-none peer-disabled:cursor-default peer-disabled:opacity-50'
)

export interface LabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  disabled?: boolean
}

const Label = ({ className, disabled, ref, ...props }: LabelProps) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      labelVariants(),
      className,
      disabled && 'cursor-default opacity-50'
    )}
    {...props}
  />
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
