import React from 'react'
import Menu from '../../components/Menu'
import { useParams } from 'react-router-dom'
import { useCacheStory } from '../../miller'

export default function PerspectiveDetail() {
  const { slug } = useParams()
  const [theme] = useCacheStory(slug, {
    withChapters: true,
  })

  console.log(theme)

  return (
    <div>
      <Menu />
      <h1>{theme.data.title}</h1>
      <p>{theme.data.abstract}</p>
    </div>
  )
}