import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import InputField from '@/components/form/input-field'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import useAuth from '@/hooks/use-auth'
import { useThrottle } from '@/hooks/use-throttle'
import { VerifyEmailFields, verifyEmailSchema } from '@/schemas/auth-schema'

export default function VerifyEmailPage() {
  const {
    emailSendCountdown,
    sendVerificationEmail,
    startEmailSendCountdown,
    verifyEmailByToken,
    logout
  } = useAuth()

  const { user } = useAuth()

  const params = useSearch({ from: '/auth/verify-email' })
  const token = (params && params.token) || ''

  const form = useForm<VerifyEmailFields>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token }
  })

  useEffect(() => {
    token && verifyEmailByToken(token)
    startEmailSendCountdown({ resetTargetTime: false })
  }, [])

  const [handleVerifyEmail, isVerifyingEmail] = useThrottle(
    ({ token }: VerifyEmailFields) => verifyEmailByToken(token)
  )

  return (
    <main className='mx-auto flex w-full max-w-87.5 flex-col items-center gap-y-4'>
      <h2 className='mt-4 text-4xl font-bold'>Verify Email</h2>
      <p className='text-muted-foreground text-xl font-light'>
        Complete your registration
      </p>
      <Form {...form}>
        <form
          className='flex w-full flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(handleVerifyEmail)}>
          <p className='text-center text-sm'>
            Check your inbox and click the registration link.
          </p>
          {user?.email && (
            <p className='text-center text-sm'>
              An email was sent to:{' '}
              <span className='text-primary'>{user.email}</span>{' '}
            </p>
          )}
          <p className='text-center text-sm'>
            Or enter the verification token into the field below:
          </p>

          <InputField form={form} name='token' label='Verification token' />

          <Button
            className='mt-4 w-full'
            type='submit'
            disabled={isVerifyingEmail}>
            Verify Using Token
          </Button>
          {user ? (
            <>
              <Button
                className='w-full'
                variant='secondary'
                type='button'
                disabled={emailSendCountdown > 0}
                onClick={() => sendVerificationEmail(user?.email)}>
                {emailSendCountdown > 0
                  ? `Send Again (${emailSendCountdown})`
                  : 'Resend Email'}
              </Button>
              <Button
                type='button'
                variant='link'
                className='w-full hover:no-underline'
                onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <p className='text-sm'>
              Back to{' '}
              <Link to='/login' className='text-primary'>
                log in
              </Link>
            </p>
          )}
        </form>
      </Form>
    </main>
  )
}
