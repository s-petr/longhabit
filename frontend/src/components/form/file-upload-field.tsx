import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useAuth from '@/hooks/use-auth'
import { cn } from '@/lib/shadcn'
import { TrashIcon, UploadIcon } from '@radix-ui/react-icons'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

export default function UploadFileField<T extends FieldValues>({
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
  label ??=
    name.length < 2 ? name : name[0].toUpperCase() + name.slice(1).toLowerCase()

  const fileUploadRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { user } = useAuth()
  const { avatar, id: userId } = user ?? {}

  const unlinkImageRef = () => {
    if (previewUrl && previewUrl !== 'delete') URL.revokeObjectURL(previewUrl)
  }

  const cleanupImageRef = useEffectEvent(unlinkImageRef)

  useEffect(() => {
    return cleanupImageRef
  }, [])

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <FormItem className={cn('w-full', hidden && 'hidden')}>
          <div className='flex items-baseline justify-between'>
            <FormLabel disabled={disabled}>{label}</FormLabel>
            <FormMessage className='text-xs font-normal' />
          </div>
          <FormControl>
            <div className='flex gap-2'>
              <div className='relative w-full'>
                <Avatar className='absolute top-1/2 left-2 flex size-6 -translate-y-1/2 items-center justify-center'>
                  <AvatarImage
                    src={
                      value
                        ? previewUrl || undefined
                        : avatar && userId && previewUrl !== 'delete'
                          ? `/api/files/users/${userId}/${avatar}?thumb=100x100`
                          : undefined
                    }
                    alt='user avatar icon'
                  />
                </Avatar>
                <Input
                  readOnly
                  disabled
                  type='text'
                  value={
                    value
                      ? fileUploadRef.current?.value.replace(
                          /C:\\fakepath\\/,
                          ''
                        ) || ''
                      : avatar && previewUrl !== 'delete'
                        ? avatar
                        : ''
                  }
                  className='pr-7 pl-10 disabled:opacity-100'
                />
                <div
                  role='button'
                  className='absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer'
                  onClick={() => {
                    unlinkImageRef()
                    setPreviewUrl('delete')
                    onChange(null)
                  }}>
                  {avatar && previewUrl !== 'delete' && (
                    <TrashIcon className='size-4' />
                  )}
                </div>
                <Input
                  ref={fileUploadRef}
                  type='file'
                  accept='image/jpeg,image/png,image/gif,image/webp'
                  disabled={disabled}
                  className='hidden'
                  onChange={(e) => {
                    const uploadedFile = e.target.files?.[0] || null

                    if (uploadedFile && uploadedFile.size > 5242880) {
                      form.setError(name, {
                        type: 'manual',
                        message: 'File too large (5MB max)'
                      })
                      return
                    }

                    form.clearErrors(name)

                    unlinkImageRef()

                    if (uploadedFile) {
                      const newUrl = URL.createObjectURL(uploadedFile)
                      setPreviewUrl(newUrl)
                      onChange(uploadedFile)
                    } else {
                      setPreviewUrl(null)
                      onChange(null)
                    }
                  }}
                />
              </div>
              <Button
                type='button'
                variant='outline'
                className='flex w-40 gap-1.5'
                onClick={() => fileUploadRef.current?.click()}>
                <UploadIcon className='size-4' />
                Choose file
              </Button>
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
