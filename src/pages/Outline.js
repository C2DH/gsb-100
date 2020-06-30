import React from 'react'
import Menu from '../components/Menu'
import { useCacheStory } from '../miller'

export default function Outline() {
  const [outlineStory] = useCacheStory('outline')
  const [outlineStoryX] = useCacheStory('outline-1', {
    withChapters: true,
  })
  // PRIMA 3 Dimensione fisse altri 3 SOno il doppio
  // sempre 6
  console.log('Outline Story', outlineStory, outlineStoryX)
  return (
    <div>
      <Menu />
      <h1>Outline</h1>
    </div>
  )
}