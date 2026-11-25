import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  HeadContent,
  RouterProvider,
  redirect
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { z } from 'zod/v4'

import NotFoundPage from '@/pages/not-found'
import RootLayout from '@/root-layout'
import { taskQueryOptions, tasksQueryOptions } from '@/services/api-tasks'
import Spinner from './components/shared/spinner'
import { setTheme } from './lib/set-theme'
import ForgotPasswordPage from './pages/auth/forgot-password'
import LoginPage from './pages/auth/login'
import RegisterPage from './pages/auth/register'
import ResetPasswordPage from './pages/auth/reset-password'
import VerifyEmailPage from './pages/auth/verify-email'
import ErrorPage from './pages/error'
import HomePage from './pages/home'
import PrivacyPolicyPage from './pages/privacy-policy'
import EditTaskPage from './pages/tasks/edit-task'
import NewTaskPage from './pages/tasks/new-task'
import SettingsPage from './pages/tasks/settings'
import TasksPage from './pages/tasks/tasks'
import {
  resetPasswordParamsSchema,
  verifyEmailParamsSchema
} from './schemas/auth-schema'
import { pbIdSchema } from './schemas/pb-schema'
import {
  checkEmailIsVerified,
  checkUserIsLoggedIn,
  checkVerifiedUserIsLoggedIn,
  userQueryOptions
} from './services/api-auth'

interface RootContext {
  queryClient: QueryClient
}

function pageHead(...titleParts: string[]) {
  const title = [...titleParts, 'Long Habit'].join(' · ')
  return () => ({ meta: [{ title }] })
}

const rootRoute = createRootRouteWithContext<RootContext>()({
  component: RootLayout,
  shellComponent: ({ children }) => (
    <>
      <HeadContent />
      {children}
    </>
  ),
  head: pageHead(),
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
  validateSearch: z.object({
    logout: z.boolean().optional()
  }),

  loader: ({ context: { queryClient } }) =>
    queryClient.query({ ...userQueryOptions, staleTime: 'static' }),
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = queryClient.getQueryData(userQueryOptions.queryKey)
    setTheme(user?.settings?.theme)
  }
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
  pendingComponent: Spinner,
  beforeLoad: async () => {
    if (checkVerifiedUserIsLoggedIn()) throw redirect({ to: '/tasks' })
  }
})

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: PrivacyPolicyPage,
  pendingComponent: Spinner,
  head: pageHead('Privacy Policy')
})

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  beforeLoad: ({ location }) => {
    if (location.pathname.includes('reset-password')) return
    if (checkVerifiedUserIsLoggedIn()) throw redirect({ to: '/tasks' })
  }
})

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'login',
  component: LoginPage,
  head: pageHead('Login'),
  beforeLoad: () => {
    if (checkUserIsLoggedIn() && !checkEmailIsVerified())
      throw redirect({ to: '/verify-email' })
  }
})

const registerRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'register',
  component: RegisterPage,
  head: pageHead('Register'),
  beforeLoad: () => {
    if (checkUserIsLoggedIn() && !checkEmailIsVerified())
      throw redirect({ to: '/verify-email' })
  }
})

const verifyEmailRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'verify-email',
  component: VerifyEmailPage,
  validateSearch: verifyEmailParamsSchema,
  head: pageHead('Verify Email')
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'forgot-password',
  component: ForgotPasswordPage,
  head: pageHead('Forgot Password'),
  beforeLoad: () => {
    if (checkUserIsLoggedIn() && !checkEmailIsVerified())
      throw redirect({ to: '/verify-email' })
  }
})

const resetPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'reset-password',
  component: ResetPasswordPage,
  validateSearch: resetPasswordParamsSchema,
  head: pageHead('Reset Password')
})

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'tasks',
  component: TasksPage,
  pendingComponent: Spinner,
  head: pageHead('Tasks'),
  beforeLoad: () => {
    if (!checkVerifiedUserIsLoggedIn()) throw redirect({ to: '/login' })
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.query({ ...tasksQueryOptions, staleTime: 'static' })
})

const settingsRoute = createRoute({
  getParentRoute: () => tasksRoute,
  path: 'settings',
  component: SettingsPage,
  head: pageHead('Settings', 'Tasks')
})

const newTaskRoute = createRoute({
  getParentRoute: () => tasksRoute,
  path: 'new',
  component: NewTaskPage,
  head: pageHead('New', 'Tasks')
})

const editTaskRoute = createRoute({
  getParentRoute: () => tasksRoute,
  path: '$taskId',
  component: EditTaskPage,
  head: pageHead('Edit', 'Tasks'),
  loader: ({ context: { queryClient }, params: { taskId } }) => {
    const taskIdValidationResult = pbIdSchema.safeParse(taskId)
    if (taskIdValidationResult.error) throw redirect({ to: '/tasks' })
    return queryClient.query({
      ...taskQueryOptions(taskIdValidationResult.data),
      staleTime: 'static'
    })
  }
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  privacyPolicyRoute,
  authRoute.addChildren([
    loginRoute,
    registerRoute,
    verifyEmailRoute,
    forgotPasswordRoute,
    resetPasswordRoute
  ]),
  tasksRoute.addChildren([settingsRoute, newTaskRoute, editTaskRoute])
])

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  context: { queryClient }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function Router({
  devToolsEnabled
}: {
  devToolsEnabled?: boolean
}) {
  devToolsEnabled ??= import.meta.env.DEV

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {devToolsEnabled && (
        <>
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition='bottom-left'
          />
          <TanStackRouterDevtools router={router} position='bottom-right' />
        </>
      )}
    </QueryClientProvider>
  )
}
