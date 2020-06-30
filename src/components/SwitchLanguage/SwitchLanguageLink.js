import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const langRegex = /(lang=)\w+/i

function makeLangLink(location, lang) {
  let url = location.pathname + (location.search || '?').replace(langRegex, '')
  if (url.indexOf('?') !== url.length - 1) {
    url += '&'
  }
  return url + `lang=${lang}`
}

export default function SwitchLanguageLink({ lang, onClick, ...props }) {
  const { i18n } = useTranslation()
  const location = useLocation()
  const to = useMemo(() => makeLangLink(location, lang), [location, lang])

  return (
    <Link
      onClick={(e) => {
        i18n.changeLanguage(lang)
        onClick && onClick(e)
      }}
      to={to}
      {...props}
    />
  )
}
