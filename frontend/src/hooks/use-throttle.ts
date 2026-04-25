import { AnyFunction } from '@/types/utility-types'
import { useState } from 'react'

export function useThrottle(func: AnyFunction, delay: number = 1000) {
  const [timeout, saveTimeout] = useState<ReturnType<typeof setTimeout> | null>(
    null
  )
  const [isThrottled, setIsThrottled] = useState(false)

  const throttledFunc = (...args: any[]) => {
    if (timeout) return

    setIsThrottled(true)

    func(...args)

    const newTimeout = setTimeout(() => {
      saveTimeout(null)
      setIsThrottled(false)
    }, delay)

    saveTimeout(newTimeout)
  }

  return [throttledFunc, isThrottled] as const
}
