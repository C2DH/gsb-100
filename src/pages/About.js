import React from 'react'
import { useLocation } from 'react-router-dom'
import { useCacheStory, useCacheDocument } from '../miller'
import Menu from '../components/Menu'
import LangLink from '../components/LangLink'

export default function About() {
  const [aboutStory] = useCacheStory('about')
  console.log('About Story', aboutStory)
  const location = useLocation()
  const [imageDoc] = useCacheDocument(129)
  const [audioDoc] = useCacheDocument(5)
  const [videoDoc] = useCacheDocument(6)

  return (
    <div>
      <Menu />
      <h1>About</h1>
      <div>
        <LangLink
          to={{
            pathname: `/documents/${imageDoc.id}`,
            state: { background: location, modalDocument: imageDoc },
          }}
        >IMAGE DOC</LangLink>
        <br />
        <LangLink
          to={{
            pathname: `/documents/${audioDoc.id}`,
            state: { background: location, modalDocument: audioDoc },
          }}
        >AUDIO DOC</LangLink>
        <br />
        <LangLink
          to={{
            pathname: `/documents/${videoDoc.id}`,
            state: { background: location, modalDocument: videoDoc },
          }}
        >VIDEO DOC</LangLink>
      </div>
    </div>
  )
}