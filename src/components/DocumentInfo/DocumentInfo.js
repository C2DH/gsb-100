import React from 'react'
import DocumentInfoMap from './DocumentInfoMap'

export default function DocumentInfo({ doc }) {
  // TODO: Is this correct?
  if (doc.data.type === 'map') {
    return <DocumentInfoMap doc={doc} />
  }
  // TODO: Implement other document types ....
  return null
}
