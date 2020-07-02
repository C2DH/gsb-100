import React from 'react'
import DocumentInfoMap from './DocumentInfoMap'
import DocumentInfoImage from './DocumentInfoImage'

export default function DocumentInfo({ doc }) {
  // TODO: Is this correct?
  if (doc.data.type === 'map') {
    return <DocumentInfoMap doc={doc} />
  } else if (doc.data.type === 'caricature') {
    return <DocumentInfoImage doc={doc} />
  }
  // TODO: Implement other document types ....
  return null
}
