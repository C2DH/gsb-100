import React from 'react'
import { useTranslation } from 'react-i18next'
import { useCacheStory } from '../miller'

export default function Home() {
  const { t } = useTranslation()

  const [homeStory] = useCacheStory('home')
  console.log('Home Story', homeStory)

  return (
    <div>
      <h1>{t('hello')}</h1>
    </div>
  )
}