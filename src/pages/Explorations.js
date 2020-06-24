import React from 'react'
import Menu from '../components/Menu'
import { useCacheStory } from '../miller'

export default function Explorations() {
  const [explorationsStory] = useCacheStory('explorations')
  console.log('ExplorationsStory', explorationsStory)
  return (
    <div>
      <Menu />
      <h1>Explorations</h1>
    </div>
  )
}