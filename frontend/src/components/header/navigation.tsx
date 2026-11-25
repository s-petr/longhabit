import { Link, useLocation } from '@tanstack/react-router'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import useAuth from '@/hooks/use-auth'
import { DefaultUserAvatarLogo, LongHabitMainLogo } from '../shared/logos'

export default function Navigation() {
  const { user } = useAuth()
  const { avatar, id: userId, verified } = user ?? {}
  const location = useLocation()

  return (
    <nav className='flex items-center justify-between'>
      <Link to='/' className='focus:outline-hidden'>
        <LongHabitMainLogo />
      </Link>
      <Link
        aria-label='user account or log in'
        to={verified ? '/tasks/settings' : '/login'}
        className='focus:outline-hidden'>
        <Avatar className='flex size-10 items-center justify-center'>
          {avatar && !location.search.logout ? (
            <AvatarImage
              src={`/api/files/users/${userId}/${avatar}?thumb=100x100`}
              alt='user avatar icon'
            />
          ) : (
            <DefaultUserAvatarLogo />
          )}
        </Avatar>
      </Link>
    </nav>
  )
}
