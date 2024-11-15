import { UpdateUserSettingsFields, userSchema } from '@/schemas/user-schema'
import { newPb } from './pocketbase'

export async function getSettings(userId?: string) {
  const pb = newPb()
  userId ??= pb.authStore.model?.id

  const settings = await pb
    .collection('settings')
    .getFirstListItem(`user="${userId}"`)

  if (!settings) throw new Error('Could not fetch settings data')

  return settings
}

export async function updateUserSettings(
  userId: string,
  formData: UpdateUserSettingsFields
) {
  const { remindEmail, remindByEmailEnabled, theme, ...userData } = formData
  const { oldPassword, password, passwordConfirm } = userData
  const userIsChangingPassword = oldPassword && password && passwordConfirm

  const pb = newPb()

  const newUserData = userSchema.parse(
    await pb.collection('users').update(userId, userData)
  )

  userIsChangingPassword &&
    (await pb.collection('users').authWithPassword(newUserData.email, password))

  const settings = await pb
    .collection('settings')
    .getFirstListItem(`user="${newUserData.id}"`)

  settings &&
    (await pb.collection('settings').update(settings.id, {
      remindEmail,
      remindByEmailEnabled,
      theme
    }))
}
