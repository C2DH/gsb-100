import React from 'react'
import DocumentInfoImage from './DocumentInfoImage'
import DocumentInfoVideo from './DocumentInfoVideo'
import DocumentInfoAudio from './DocumentInfoAudio'
import DocumentInfoPdf from './DocumentInfoPdf'

export default function DocumentInfo({ doc }) {
  if (doc.type === 'image') {
    return <DocumentInfoImage doc={doc} />
  } else if (doc.type === 'video') {
    return <DocumentInfoVideo doc={doc} />
  } else if (doc.type === 'audio') {
    return <DocumentInfoAudio doc={doc} />
  } else if (doc.type === 'pdf') {
    return <DocumentInfoPdf doc={doc} />
  }
  // TODO: Implement other document types ....
  return null
}
