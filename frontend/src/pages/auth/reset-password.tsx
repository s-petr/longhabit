import PasswordField from '@/components/form/password-field'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import useAuth from '@/hooks/use-auth'
import { useThrottle } from '@/hooks/use-throttle'
import { ResetPasswordFields, resetPasswordSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export default function ResetPasswordPage() {
  const { confirmPasswordReset } = useAuth()
  const navigate = useNavigate()

  const { token } = useSearch({ from: '/auth/reset-password' })

  const form = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: ''
    }
  })

  const [handleResetPassword, isResettingPassword] = useThrottle(
    ({ password, passwordConfirm }: ResetPasswordFields) =>
      confirmPasswordReset(password, passwordConfirm, token)
  )

  if (!token) return navigate({ to: '/login' })

  return (
    <main className='mx-auto flex w-full max-w-87.5 flex-col items-center gap-y-4'>
      <h2 className='mt-4 text-4xl font-bold'>Reset Password</h2>
      <p className='text-muted-foreground text-center text-xl font-light'>
        Enter your new password
      </p>
      <Form {...form}>
        <form
          className='flex w-full flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(handleResetPassword)}>
          <PasswordField form={form} name='password' label='New password' />
          <PasswordField
            form={form}
            name='passwordConfirm'
            label='Confirm new password'
          />

          <Button
            className='mt-4 w-full'
            type='submit'
            disabled={!form.formState.isDirty || isResettingPassword}>
            Change Password
          </Button>
        </form>
      </Form>
      <p className='text-sm'>
        Back to{' '}
        <Link to='/login' className='text-primary'>
          login
        </Link>
      </p>
    </main>
  )
}
