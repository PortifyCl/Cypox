import { useCallback } from 'react'
import { useNavigate } from 'react-router'

export function usePageTransition() {
  const navigate = useNavigate()

  const transitionTo = useCallback((to, options) => {
    if (!document.startViewTransition) {
      navigate(to, options)
      return
    }
    document.startViewTransition(() => {
      navigate(to, options)
    })
  }, [navigate])

  return transitionTo
}
