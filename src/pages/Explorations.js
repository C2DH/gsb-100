import React from 'react'
import Menu from '../components/Menu'
import { useCacheStory } from '../miller'
import LangLink from '../components/LangLink'

export default function Explorations() {
  const [explorationsStory] = useCacheStory('explorations')
  console.log('ExplorationsStory', explorationsStory)
  return (
    <div>
      <Menu />
      <h1>Explorations</h1>

      <div>
        <p>
          <LangLink to="/explorations/all">ALL</LangLink>
        </p>
        <p>
          <LangLink to="/explorations/alternative">ALTERNATIVE</LangLink>
        </p>
        <p>
          <LangLink to="/explorations/gender">GENDER</LangLink>
        </p>
        <p>
          <LangLink to="/explorations/the-idea-of-borders">
            THE IDEA OF BORDERS
          </LangLink>
        </p>
      </div>
    </div>
  )
}
