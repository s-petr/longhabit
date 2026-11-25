import { ChevronUpIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/shadcn'
import { Button } from '../ui/button'

export default function ScrollToTopButton({
  className
}: {
  className?: string
}) {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const checkScrollHeight = () => {
      if (!showButton && window.scrollY > 400) {
        setShowButton(true)
      } else if (showButton && window.scrollY <= 400) {
        setShowButton(false)
      }
    }

    window.addEventListener('scroll', checkScrollHeight)
    return () => window.removeEventListener('scroll', checkScrollHeight)
  }, [showButton])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    showButton && (
      <Button
        variant='link'
        className={cn(
          'hover:bg-popover mx-auto mb-2 size-10 items-center gap-1 rounded-full p-0 transition-all duration-150 ease-in-out',
          className
        )}
        disabled={!showButton}
        onClick={scrollToTop}>
        <ChevronUpIcon className='text-foreground scale-150' />
      </Button>
    )
  )
}
