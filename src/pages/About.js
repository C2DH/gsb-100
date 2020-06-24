import React from 'react'
import { useCacheStory } from '../miller'
import Menu from '../components/Menu'

export default function About() {
  const [aboutStory] = useCacheStory('about')
  console.log('About Story', aboutStory)
  return (
    <div>
      <Menu />
      <h1>About</h1>
    </div>
  )
}