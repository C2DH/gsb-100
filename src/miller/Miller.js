import React, { useMemo, useState, useCallback } from 'react'
import { ConfigureRj } from 'react-rocketjump'
import { MillerContext } from './internal'

function ControlledLangMillerProvider({
  children,
  apiUrl,
  lang,
  langs,
  fallbackLang = null,
  cache = false,
  suspense = false,
}) {
  const millerConfig = useMemo(
    () => ({
      lang,
      langs,
      apiUrl,
      fallbackLang,
      setLang: null,
      cache,
      suspense,
    }),
    [apiUrl, lang, langs, fallbackLang, cache, suspense]
  )
  return (
    <MillerContext.Provider value={millerConfig}>
      {children}
    </MillerContext.Provider>
  )
}

function UncontrolledLangMillerProvider({
  children,
  langs,
  defaultLang,
  apiUrl,
  fallbackLang = null,
  cache = false,
  suspense = false,
}) {
  const [lang, setLang] = useState(defaultLang)
  const millerConfig = useMemo(
    () => ({
      lang,
      apiUrl,
      langs,
      fallbackLang,
      suspense,
      setLang,
      cache,
    }),
    [apiUrl, lang, langs, fallbackLang, cache, suspense]
  )
  return (
    <MillerContext.Provider value={millerConfig}>
      {children}
    </MillerContext.Provider>
  )
}

export default function Miller({
  defaultLang,
  lang,
  apiUrl,
  hashParams,
  children,
  ...props
}) {
  const callMyMiller = useCallback(
    (apiCall, ...args) => {
      return apiCall({ apiUrl, hashParams }, ...args)
    },
    [apiUrl, hashParams]
  )

  const millerChildren = (
    <ConfigureRj effectCaller={callMyMiller}>{children}</ConfigureRj>
  )

  if (lang === undefined) {
    return (
      <UncontrolledLangMillerProvider
        defaultLang={defaultLang}
        apiUrl={apiUrl}
        {...props}
      >
        {millerChildren}
      </UncontrolledLangMillerProvider>
    )
  } else {
    return (
      <ControlledLangMillerProvider lang={lang} apiUrl={apiUrl} {...props}>
        {millerChildren}
      </ControlledLangMillerProvider>
    )
  }
}
