import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { usePlausible } from '@/context/plausible-context'
import { errorToast, successToast } from '@/lib/toast'
import { UpdateUserSettingsFields } from '@/schemas/user-schema'
import { userQueryOptions } from '@/services/api-auth'
import { updateUserSettings } from '@/services/api-settings'

export default function useSettings() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { trackEvent } = usePlausible()
  const { data, isLoading } = useSuspenseQuery(userQueryOptions)

  const { name, id: userId, settings, authWithPasswordAvailable } = data ?? {}
  const remindEmail = settings?.remindEmail ?? ''
  const remindByEmailEnabled = settings?.remindByEmailEnabled
  const theme = settings?.theme || 'system'

  const updateSettingsMutation = useMutation({
    mutationFn: ({
      userId,
      data
    }: {
      userId: string
      data: UpdateUserSettingsFields
    }) => updateUserSettings(userId, data),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['user'] })
      const previousUser = queryClient.getQueryData(['user'])

      queryClient.setQueryData(['user'], (currentUser: any) => ({
        ...currentUser,
        name: newData.data.name,
        settings: {
          ...currentUser.settings,
          theme: newData.data.theme,
          remindEmail: newData.data.remindEmail,
          remindByEmailEnabled: newData.data.remindByEmailEnabled
        }
      }))

      return { previousUser }
    },

    onSuccess: () => {
      trackEvent('settings-update')
      successToast('Success!', 'Account details were updated successfully')
      navigate({ to: '/tasks' })
    },

    onError: (error, _, context) => {
      console.error(error)
      queryClient.setQueryData(['user'], context?.previousUser)
      errorToast('Could not update account details', error)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })

  const updateSettings = (userId: string, userData: UpdateUserSettingsFields) =>
    updateSettingsMutation.mutate({ userId, data: userData })

  return {
    userId,
    name,
    remindEmail,
    remindByEmailEnabled,
    theme,
    authWithPasswordAvailable,
    isLoading,
    updateSettings
  }
}
