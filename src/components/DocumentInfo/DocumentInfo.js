import React from 'react'
import DocumentInfoImage from './DocumentInfoImage'
import DocumentInfoVideo from './DocumentInfoVideo'

export default function DocumentInfo({ doc }) {
  if (doc.type === 'image') {
    return <DocumentInfoImage doc={doc} />
  } else if (doc.type === 'video') {
    return <DocumentInfoVideo doc={doc} />
  }
  // TODO: Implement other document types ....
  return null
}
