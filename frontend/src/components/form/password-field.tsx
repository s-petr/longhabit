import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
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

export default function PasswordField<T extends FieldValues>({
  form,
  name,
  label,
  disabled = false,
  hidden = false
}: {
  form: UseFormReturn<T>
  name: Path<T>
  label?: string
  disabled?: boolean
  hidden?: boolean
}) {
  const [isVisible, setIsVisible] = useState(false)

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
          <div className='relative'>
            <FormControl>
              <Input
                className='pr-8'
                type={isVisible ? 'text' : 'password'}
                {...field}
                disabled={disabled}
              />
            </FormControl>
            {!!field.value.length && (
              <div
                role='button'
                className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer'
                onClick={() => setIsVisible((current) => !current)}>
                {isVisible ? (
                  <EyeOpenIcon className='text-muted-foreground size-4' />
                ) : (
                  <EyeClosedIcon className='text-muted-foreground size-4' />
                )}
              </div>
            )}
          </div>
        </FormItem>
      )}
    />
  )
}
