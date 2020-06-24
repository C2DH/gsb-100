import React from 'react'
import Menu from '../components/Menu'
import { Link } from 'react-router-dom'
import { useCacheStory } from '../miller'

export default function Explorations() {
  const [explorationsStory] = useCacheStory('explorations')
  console.log('ExplorationsStory', explorationsStory)
  return (
    <div>
      <Menu />
      <h1>Explorations</h1>

      <div>
        <p>
          <Link to="/explorations/all">ALL</Link>
        </p>
        <p>
          <Link to="/explorations/alternative">ALTERNATIVE</Link>
        </p>
        <p>
          <Link to="/explorations/gender">GENDER</Link>
        </p>
        <p>
          <Link to="/explorations/the-idea-of-borders">
            THE IDEA OF BORDERS
          </Link>
        </p>
      </div>
    </div>
  )
}
