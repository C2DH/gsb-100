import React from 'react'
import { useCacheStory } from '../miller'
import Menu from '../components/Menu'

export default function Perspectives() {
  const [perspectivesStory] = useCacheStory('perspectives')
  console.log('Perspectives', perspectivesStory)

  return (
    <div>
      <Menu />
      <h1>Perspectives</h1>
    </div>
  )
}