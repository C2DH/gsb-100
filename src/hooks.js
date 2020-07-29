import qs from 'query-string'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { useLayoutEffect, useMemo, useCallback } from 'react'

function namespacePath(path, lang) {
  let pathWithLang = `/${lang}`
  if (path[0] === '/') {
    pathWithLang += path
  } else {
    pathWithLang += `/${path}`
  }
  return pathWithLang
}

export function useQueryString() {
  const location = useLocation()
  const hisotry = useHistory()

  const queryString = useMemo(() => {
    return qs.parse(location.search)
  }, [location.search])

  const setQueryString = useCallback((newQueryString) => {
    hisotry.push(`${location.pathname}?${qs.stringify(newQueryString)}`)
  }, [location.pathname, hisotry])

  return [queryString, setQueryString]
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

