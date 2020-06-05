import { useCallback, useContext, useMemo } from 'react'
import { MillerContext } from './internal'

function translateMiller(data, lang, langs, fallbackLang) {
  // Primitive types can't translate them
  const dataType = typeof data
  if (
    data === null ||
    data === undefined ||
    dataType === 'number' ||
    dataType === 'string' ||
    dataType === 'boolean' ||
    dataType === 'symbol'
  ) {
    return data
  }
  // Iteree over them and translate
  if (Array.isArray(data)) {
    return data.map((item) => translateMiller(item, lang, langs, fallbackLang))
  }
  // Empty object return them
  const keys = Object.keys(data)
  if (keys.length === 0) {
    return data
  }
  // CAN TRANSLATE!
  if (data[lang] !== undefined) {
    return data[lang]
  } else if (fallbackLang !== null && data[fallbackLang] !== undefined) {
    // Use fallback lang!
    return data[fallbackLang]
  } else if (langs && langs.length) {
    // Ok at this point check if this objects
    // containts other langs and if return null
    if (langs.some((lang) => data[lang])) {
      return null
    }
  }
  // Iteree over values
  const obj = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    obj[key] = translateMiller(data[key], lang, langs, fallbackLang)
  }
  return obj
}

export function useTranslator() {
  const { langs, lang, fallbackLang } = useContext(MillerContext)
  return useCallback(
    (data) => translateMiller(data, lang, langs, fallbackLang),
    [lang, langs, fallbackLang]
  )
}

export function useTranslate(data) {
  const { langs, lang, fallbackLang } = useContext(MillerContext)
  return useMemo(
    () => translateMiller(data, lang, langs, fallbackLang),
    [lang, langs, fallbackLang, data]
  )
}