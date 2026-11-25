import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { cn } from '@/lib/shadcn'
import { Textarea } from '../ui/textarea'

export default function TextAreaField<T extends FieldValues>({
  form,
  name,
  label,
  rows = 3,
  disabled = false,
  hidden = false
}: {
  form: UseFormReturn<T>
  name: Path<T>
  label?: string
  type?: React.HTMLInputTypeAttribute
  rows?: number
  disabled?: boolean
  hidden?: boolean
}) {
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
            <Textarea {...field} disabled={disabled} rows={rows} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
