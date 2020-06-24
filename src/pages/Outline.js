import React from 'react'
import Menu from '../components/Menu'
import { useCacheStory } from '../miller'

export default function Outline() {
  const [outlineStory] = useCacheStory('outline')
  console.log('Outline Story', outlineStory)
  return (
    <div>
      <Menu />
      <h1>Outline</h1>
    </div>
  )
}