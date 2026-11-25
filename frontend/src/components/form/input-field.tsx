import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/shadcn'

type InputFieldProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  name: Path<T>
  label?: string
  disabled?: boolean
  hidden?: boolean
} & (
  | {
      type?: Exclude<React.HTMLInputTypeAttribute, 'number'>
      min?: never
      max?: never
    }
  | {
      type: 'number'
      min?: number
      max?: number
    }
)

export default function InputField<T extends FieldValues>({
  form,
  name,
  label,
  type = 'text',
  disabled = false,
  hidden = false,
  min,
  max
}: InputFieldProps<T>) {
  label ??=
    name.length < 2 ? name : name[0].toUpperCase() + name.slice(1).toLowerCase()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full', hidden && 'hidden')}>
          <div className='flex items-baseline justify-between'>
            <FormLabel disabled={disabled}>{label}</FormLabel>
            <FormMessage className='text-xs font-normal' />
          </div>
          <FormControl>
            <Input
              type={type}
              {...field}
              disabled={disabled}
              min={min}
              max={max}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
