import React from 'react'
import DocumentInfoImage from './DocumentInfoImage'

export default function DocumentInfo({ doc }) {
  if (doc.type === 'image') {
    return <DocumentInfoImage doc={doc} />
  }
  // TODO: Implement other document types ....
  return null
}
