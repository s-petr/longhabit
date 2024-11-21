import InputField from '@/components/form/input-field'
import PasswordField from '@/components/form/password-field'
import SwitchField from '@/components/form/switch-field'
import ThemeSwitch from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import useAuth from '@/hooks/use-auth'
import useSettings from '@/hooks/use-settings'
import {
  UpdateUserSettingsFields,
  updateUserSettingsSchema
} from '@/schemas/user-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'

export default function SettingsForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const { logout } = useAuth()

  const {
    userId,
    name,
    remindEmail,
    remindByEmailEnabled,
    theme,
    authWithPasswordAvailable,
    updateSettings
  } = useSettings()

  const form = useForm<UpdateUserSettingsFields>({
    resolver: zodResolver(updateUserSettingsSchema),
    defaultValues: {
      name,
      theme,
      remindEmail,
      remindByEmailEnabled,
      oldPassword: '',
      password: '',
      passwordConfirm: ''
    }
  })

  const fieldsEdited = form.formState.isDirty

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className='flex w-full flex-col items-center gap-y-4'
        onSubmit={form.handleSubmit(
          (userData) => userId && updateSettings(userId, userData)
        )}>
        <SheetHeader className='w-full'>
          <SheetTitle className='pb-4 text-4xl font-bold'>Settings</SheetTitle>
          <SheetDescription className='hidden'>Settings</SheetDescription>
        </SheetHeader>

        <p className='w-full text-xl font-light text-muted-foreground'>
          Account Settings
        </p>

        <FormField
          control={form.control}
          name='avatar'
          render={({ field }) => (
            <FormItem className='w-full'>
              <div className='flex items-baseline justify-between'>
                <FormLabel>Upload avatar image</FormLabel>
                <FormMessage className='text-xs font-normal' />
              </div>
              <FormControl>
                <Input
                  type='file'
                  onChange={(e) =>
                    e.target.files?.length && field.onChange(e.target.files[0])
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

        <InputField form={form} name='name' />

        <FormField
          control={form.control}
          name='theme'
          render={({ field }) => (
            <FormItem className='mr-auto'>
              <FormLabel className='!mt-0 cursor-pointer'>Theme</FormLabel>
              <div className='flex items-center gap-x-1'>
                <FormControl>
                  <ThemeSwitch
                    theme={field.value}
                    onThemeChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className='!mt-0 cursor-pointer capitalize'>
                  {field.value}
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <p className='w-full text-xl font-light text-muted-foreground'>
          Notification Settings
        </p>

        <InputField
          form={form}
          name='remindEmail'
          type='email'
          label='Email for reminders'
        />

        <SwitchField
          form={form}
          name='remindByEmailEnabled'
          label='Enable email reminders '
        />

        {authWithPasswordAvailable && (
          <>
            <p className='w-full text-xl font-light text-muted-foreground'>
              Change Password
            </p>

            <PasswordField
              form={form}
              name='oldPassword'
              label='Current password'
            />

            <PasswordField form={form} name='password' label='New password' />

            <PasswordField
              form={form}
              name='passwordConfirm'
              label='Confirm new password'
            />
          </>
        )}

        <SheetFooter className='mt-4 flex w-full items-center gap-4 sm:justify-between'>
          <Button disabled={!fieldsEdited} className='w-full' type='submit'>
            Update Settings
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' type='button' className='w-full'>
                Log out
              </Button>
            </DialogTrigger>
            <DialogContent className='bg-card sm:max-w-[300px]'>
              <DialogHeader>
                <DialogTitle>Logging out</DialogTitle>
                <DialogDescription>
                  Are you sure you want to log out?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className='flex items-center gap-4 sm:justify-between'>
                <DialogClose asChild>
                  <Button
                    type='button'
                    className='w-full'
                    size='sm'
                    variant='outline'>
                    Cancel
                  </Button>
                </DialogClose>
                <Button className='w-full' size='sm' onClick={logout}>
                  Log out
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SheetFooter>
      </form>
    </Form>
  )
}