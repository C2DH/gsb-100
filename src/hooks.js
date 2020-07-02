import { useParams } from 'react-router-dom'
import { useLayoutEffect } from 'react'

function namespacePath(path, lang) {
  let pathWithLang = `/${lang}`
  if (path[0] === '/') {
    pathWithLang += path
  } else {
    pathWithLang += `/${path}`
  }
  return pathWithLang
}

export function useToWithLang(to) {
  const { lang } = useParams()

  if (typeof to === 'string') {
    return namespacePath(to, lang)
  } else {
    return {
      ...to,
      pathname: namespacePath(to.pathname, lang)
    }
  }
}

let bodyOverflowReferenceCount = 0
export function useBodyNoOverflow() {
  useLayoutEffect(() => {
    const body = document.getElementsByTagName('body')[0]
    bodyOverflowReferenceCount++
    // Append class to body only to the first user
    if (bodyOverflowReferenceCount === 1) {
      body.classList.add('no-overflow')
    }
    return () => {
      bodyOverflowReferenceCount--
      // Remove class to body only when no active instances
      if (bodyOverflowReferenceCount === 0) {
        body.classList.remove('no-overflow')
      }
    }
  }, [])
}

