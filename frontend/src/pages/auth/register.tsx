import InputField from '@/components/form/input-field'
import PasswordField from '@/components/form/password-field'
import { GoogleLogo } from '@/components/shared/logos'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import useAuth from '@/hooks/use-auth'
import { useThrottle } from '@/hooks/use-throttle'
import { RegisterFields, registerSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth()

  const form = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: ''
    }
  })

  const [handleRegister, isRegistering] = useThrottle(register)

  return (
    <main className='mx-auto flex w-full max-w-87.5 flex-col items-center gap-y-4'>
      <h2 className='mt-4 text-4xl font-bold'>Register</h2>
      <p className='text-muted-foreground text-center text-xl font-light'>
        Enter your details to create a new account
      </p>
      <Form {...form}>
        <form
          className='flex w-full flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(handleRegister)}>
          <InputField form={form} name='name' />
          <InputField form={form} name='email' type='email' />
          <PasswordField form={form} name='password' />
          <PasswordField
            form={form}
            name='passwordConfirm'
            label='Confirm password'
          />

          <Button
            className='mt-4 w-full'
            type='submit'
            disabled={!form.formState.isDirty || isRegistering}>
            Register
          </Button>
          <Button
            className='w-full'
            variant='secondary'
            type='button'
            onClick={loginWithGoogle}>
            <GoogleLogo />
            Sign Up with Google
          </Button>
        </form>
      </Form>
      <p className='text-sm'>
        Already have an account?{' '}
        <Link to='/login' className='text-primary'>
          Log in
        </Link>
      </p>
    </main>
  )
}
