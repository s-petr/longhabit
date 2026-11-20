import { Button } from '@/components/ui/button'
import { usePlausible } from '@/context/plausible-context'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export default function ErrorPage({ error }: ErrorComponentProps) {
  const { history } = useRouter()
  const { trackEvent } = usePlausible()
  const errorMessage = error instanceof Error ? error.message : ''

  useEffect(() => {
    trackEvent('error', { props: { error: errorMessage || 'Unknown error' } })
  }, [])

  return (
    <main className='flex flex-col items-center gap-y-4 text-center'>
      <div className='mt-8 space-y-2 text-4xl font-bold sm:text-5xl'>
        Internal server error
      </div>
      <p className='text-lg font-light sm:text-xl'>
        Something went wrong. We apologize for the inconvenience.
      </p>
      {errorMessage && <p className='text-sm'>{errorMessage}</p>}
      <Button
        variant='link'
        className='w-32 hover:no-underline'
        onClick={() => history.go(-1)}>
        ← Go back
      </Button>
    </main>
  )
}
