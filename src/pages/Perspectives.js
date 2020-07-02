import React from 'react'
import { useCacheStory, useCacheStories } from '../miller'
import Menu from '../components/Menu'

export default function Perspectives() {
  const params = {
    limit: 50,
    orderby: 'priority',
    filters: { tags__slug: 'theme' },
    exclude: { slug: 'outline-1' },
  }

  const [perspectivesStory] = useCacheStory('perspectives')
  const [themes] = useCacheStories(params)
  console.log(themes)

  return (
    <div>
      <Menu />
      <h1>Perspectives</h1>
    </div>
  )
}
