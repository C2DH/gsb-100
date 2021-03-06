import qs from 'query-string'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import {
  useLayoutEffect,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

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

  const setQueryString = useCallback(
    (newQueryString) => {
      hisotry.push(`${location.pathname}?${qs.stringify(newQueryString)}`)
    },
    [location.pathname, hisotry]
  )

  return [queryString, setQueryString]
}

export function usePreloadImage(imageUrl) {
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    setIsLoaded(false)
    if (imageUrl) {
      const img = new Image()
      img.src = imageUrl
      function handleImageLoad() {
        setIsLoaded(true)
      }
      img.addEventListener('load', handleImageLoad)
      return () => {
        img.removeEventListener('load', handleImageLoad)
      }
    }
  }, [imageUrl])
  return isLoaded
}

export function useToWithLang(to) {
  const { i18n } = useTranslation()
  let { lang } = useParams()
  if (!lang) {
    // NOTE: Workaround when no lang in current path
    // fallback to current i81n language ...
    lang = i18n.language.split('_')[0]
  }

  if (typeof to === 'string') {
    return namespacePath(to, lang)
  } else {
    return {
      ...to,
      pathname: namespacePath(to.pathname, lang),
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
