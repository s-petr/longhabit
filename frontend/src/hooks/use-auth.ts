import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import { usePlausible } from '@/context/plausible-context'
import { errorToast, successToast } from '@/lib/toast'
import { RegisterFields } from '@/schemas/auth-schema'
import { User, UserWithSettings } from '@/schemas/user-schema'
import {
  authRefresh,
  confirmPasswordReset as confirmPasswordResetApi,
  createNewUser,
  loginWithGoogle as loginWithGoogleApi,
  loginWithPassword as loginWithPasswordApi,
  logout as logoutApi,
  requestPasswordReset as requestPasswordResetApi,
  sendVerificationEmail as sendVerificationEmailApi,
  subscribeToUserChanges,
  unsubscribeFromUserChanges,
  userQueryOptions,
  verifyEmailByToken as verifyEmailByTokenApi
} from '@/services/api-auth'

export default function useAuth() {
  const [emailSendCountdown, setEmailSendCountdown] = useState(0)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { trackEvent } = usePlausible()

  const { data: user } = useSuspenseQuery(userQueryOptions)

  const logout = () => {
    logoutApi()
    queryClient.clear()
    unsubscribeFromUserChanges()
    router.navigate({ to: '/', search: () => ({ logout: true }) })
  }

  const subscribeUserChangeCallback = async (record: User) => {
    await authRefresh()
    router.invalidate()
    queryClient.setQueryData(['user'], record)
  }

  const loginWithPassword = async (email: string, password: string) => {
    try {
      const authResult = await loginWithPasswordApi(email, password)
      trackEvent('login', { props: { method: 'password' } })
      subscribeToUserChanges(authResult.record.id, subscribeUserChangeCallback)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.navigate({ to: '/tasks' })
    } catch (error) {
      errorToast('Could not log in', error)
    }
  }

  const loginWithGoogle = async () => {
    try {
      const authResult = await loginWithGoogleApi()
      trackEvent('login', { props: { method: 'google' } })
      subscribeToUserChanges(authResult.record.id, subscribeUserChangeCallback)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.invalidate()
      router.navigate({ to: '/tasks' })
    } catch (error) {
      errorToast('Could not log in', error)
    }
  }

  const register = async (newUserData: RegisterFields) => {
    try {
      await createNewUser(newUserData)
      trackEvent('signup')
      successToast(
        'Registration successful!',
        'Please check your inbox for a verification email'
      )
      router.navigate({ to: '/login' })
    } catch (error) {
      errorToast('Could not register', error)
    }
  }

  const startEmailSendCountdown = ({
    resetTargetTime = true
  }: {
    resetTargetTime?: boolean
  } = {}) => {
    let targetTime = parseInt(localStorage.getItem('sendEmailTimeout') || '')
    if (resetTargetTime && !targetTime) {
      targetTime = Date.now() + 60 * 1000
      localStorage.setItem('sendEmailTimeout', targetTime.toString())
    }

    const ticker = setInterval(() => {
      const secondsRemaining = Math.ceil((targetTime - Date.now()) / 1000)
      if (secondsRemaining > 0) {
        setEmailSendCountdown(secondsRemaining)
      } else {
        setEmailSendCountdown(0)
        localStorage.removeItem('sendEmailTimeout')
        clearInterval(ticker)
      }
    })
  }

  const requestPasswordReset = async (email: string) => {
    try {
      await requestPasswordResetApi(email)
      successToast(
        'Password reset email sent',
        'An email with password reset instructions has been sent to your inbox'
      )
      startEmailSendCountdown()
    } catch (error) {
      errorToast('Could not send password reset email', error)
    }
  }

  const confirmPasswordReset = async (
    password: string,
    passwordConfirm: string,
    token: string
  ) => {
    try {
      await confirmPasswordResetApi(password, passwordConfirm, token)
      successToast('Changed password', 'Your password has been updated')
      router.navigate({ to: '/login' })
    } catch (error) {
      errorToast('Could not update password', error)
    }
  }

  const sendVerificationEmail = async (email: string | undefined) => {
    try {
      if (!email) throw new Error("Unable to get logged in user's email")
      await sendVerificationEmailApi(email)
      successToast(
        'Verification email sent',
        'Please check your inbox for a verification email'
      )
      startEmailSendCountdown()
    } catch (error) {
      errorToast('Could not send verification email', error)
    }
  }

  const verifyEmailByToken = async (token: string) => {
    try {
      await verifyEmailByTokenApi(token)
      queryClient.setQueryData(['user'], (userData: UserWithSettings) =>
        userData
          ? {
              ...userData,
              verified: true
            }
          : userData
      )
      successToast(
        'Verification successful',
        'Your email address has been verified'
      )
      router.navigate({ to: '/login' })
    } catch (error) {
      errorToast('Could not verify email by token', error)
    }
  }

  return {
    user,
    logout,
    loginWithPassword,
    loginWithGoogle,
    register,
    requestPasswordReset,
    confirmPasswordReset,
    sendVerificationEmail,
    verifyEmailByToken,
    startEmailSendCountdown,
    emailSendCountdown
  }
}
