import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'

import InputField from '@/components/form/input-field'
import PasswordField from '@/components/form/password-field'
import SwitchField from '@/components/form/switch-field'
import ThemeSwitch from '@/components/settings/theme-switch'
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
  FormLabel
} from '@/components/ui/form'
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
import UploadFileField from '../form/file-upload-field'

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
      avatar: undefined,
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

        <p className='text-muted-foreground w-full text-xl font-light'>
          Account Settings
        </p>

        <UploadFileField form={form} name='avatar' label='Avatar image' />

        <InputField form={form} name='name' />

        <FormField
          control={form.control}
          name='theme'
          render={({ field }) => (
            <FormItem className='mr-auto'>
              <FormLabel className='mt-0! cursor-pointer'>Theme</FormLabel>
              <div className='flex items-center gap-x-1'>
                <FormControl>
                  <ThemeSwitch
                    theme={field.value}
                    onThemeChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className='mt-0! cursor-pointer capitalize'>
                  {field.value}
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <p className='text-muted-foreground w-full text-xl font-light'>
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
            <p className='text-muted-foreground w-full text-xl font-light'>
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

        <SheetFooter className='mt-4 grid w-full grid-cols-2 gap-4 px-0 sm:space-x-0'>
          <Button disabled={!fieldsEdited} className='w-full' type='submit'>
            Update Settings
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' type='button' className='w-full'>
                Log out
              </Button>
            </DialogTrigger>
            <DialogContent className='bg-popover sm:max-w-75'>
              <DialogHeader>
                <DialogTitle>Logging out</DialogTitle>
                <DialogDescription>
                  Are you sure you want to log out?
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className='flex items-center gap-4 sm:justify-between'>
                <Button className='w-full' onClick={logout}>
                  Log out
                </Button>
                <DialogClose asChild>
                  <Button type='button' className='w-full' variant='secondary'>
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            asChild
            variant='secondary'
            type='button'
            className='col-span-2 w-full'>
            <Link to='/tasks' preload={false}>
              Back
            </Link>
          </Button>
        </SheetFooter>
      </form>
    </Form>
  )
}
