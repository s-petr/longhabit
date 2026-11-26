import type { ErrorComponentProps } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { usePlausible } from '@/context/plausible-context'

export default function ErrorPage({ error }: ErrorComponentProps) {
  const router = useRouter()
  const { trackEvent } = usePlausible()
  const errorMessage = error instanceof Error ? error.message : ''

  useEffect(() => {
    trackEvent('error', { props: { error: errorMessage || 'Unknown error' } })
  }, [])

  return (
    <main className='flex flex-col items-center gap-y-4 text-center'>
      <div className='mt-8 space-y-2 text-4xl font-bold sm:text-5xl'>
        Unable to load this page
      </div>
      {errorMessage && <p className='text-sm'>{errorMessage}</p>}
      <Button onClick={() => router.invalidate()}>Try again</Button>
      <Button
        variant='link'
        className='w-32 hover:no-underline'
        onClick={() => router.history.go(-1)}>
        ← Go back
      </Button>
    </main>
  )
}
