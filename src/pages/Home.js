import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('hello')}</h1>
    </div>
  )
}