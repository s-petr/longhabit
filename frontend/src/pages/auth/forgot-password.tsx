import InputField from '@/components/form/input-field'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import useAuth from '@/hooks/use-auth'
import {
  ForgotPasswordFields,
  forgotPasswordSchema
} from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function ForgotPasswordPage() {
  const { requestPasswordReset, emailSendCountdown, startEmailSendCountdown } =
    useAuth()

  useEffect(() => {
    startEmailSendCountdown({ resetTargetTime: false })
  }, [])

  const form = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  })

  return (
    <main className='mx-auto flex w-full max-w-87.5 flex-col items-center gap-y-4'>
      <h2 className='mt-4 text-4xl font-bold'>Reset Password</h2>
      <p className='text-muted-foreground text-center text-xl font-light'>
        Enter your email address to request a password reset
      </p>
      <Form {...form}>
        <form
          className='flex w-full flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(({ email }) =>
            requestPasswordReset(email)
          )}>
          <InputField form={form} name='email' type='email' />

          <Button
            className='mt-4 w-full'
            type='submit'
            disabled={emailSendCountdown > 0 || !form.formState.isDirty}>
            {emailSendCountdown > 0
              ? `Send Again (${emailSendCountdown})`
              : 'Request Reset'}
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
