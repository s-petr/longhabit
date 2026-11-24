import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/shadcn'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

export default function AutoCompleteField<T extends FieldValues>({
  form,
  name,
  label,
  options = [],
  disabled = false,
  hidden = false
}: {
  form: UseFormReturn<T>
  name: Path<T>
  label?: string
  options?: string[]
  disabled?: boolean
  hidden?: boolean
}) {
  label ??=
    name.length < 2 ? name : name[0].toUpperCase() + name.slice(1).toLowerCase()
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild disabled={disabled}>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='h-9 w-full justify-between'>
                  {field.value ?? ''}
                  <ChevronsUpDown className='ml-auto opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-(--radix-popover-trigger-width) p-0'>
                <Command className='bg-transparent'>
                  <CommandInput
                    placeholder='Search categories...'
                    className='h-9'
                    onValueChange={setInputValue}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        field.onChange(inputValue)
                        setOpen(false)
                      }
                    }}
                  />
                  <CommandList>
                    <CommandEmpty className='flex justify-center p-1'>
                      <Button
                        size='sm'
                        className='w-full'
                        variant='ghost'
                        onClick={() => {
                          field.onChange(inputValue)
                          setOpen(false)
                        }}>
                        Add new category
                      </Button>
                    </CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value=''
                        onSelect={() => {
                          field.onChange('')
                          setOpen(false)
                        }}>
                        <span className='text-muted-foreground'>None</span>
                        <Check
                          className={cn(
                            'ml-auto',
                            field.value === '' ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                      {options.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={(currentValue) => {
                            field.onChange(
                              currentValue === field.value ? '' : currentValue
                            )
                            setOpen(false)
                          }}>
                          {option}
                          <Check
                            className={cn(
                              'ml-auto',
                              field.value === option
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
