import React from 'react'
import LangLink from '../LangLink'
import AudioTrack from '../AudioTrack'
import { useLocation } from 'react-router-dom'
import { usePrefetchDocument } from '../../miller'

export default function DocumentObject({ document, caption }) {
  const location = useLocation()
  const prefetchDocument = usePrefetchDocument()

  const DocLink = ({ children }) => (
    <LangLink
      onClick={() => {
        prefetchDocument(document.document_id)
      }}
      to={{
        pathname: `/documents/${document.document_id}`,
        state: { background: location, modalDocument: document },
      }}
    >
      {children}
    </LangLink>
  )

  if (document.type === 'image' || document.type === 'pdf') {
    const imagePreviewUrl = document.data.resolutions?.preview?.url
    return (
      <div>
        <DocLink>
          <img
            alt={document.data.title}
            src={imagePreviewUrl}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
          <p className="text-primary">{caption}</p>
        </DocLink>
      </div>
    )
  } else if (document.type === 'video' && document.url) {
    const videoUrl = document.url
    // TODO: Fix object video with good dimension.....
    return (
      <div>
        <video style={{ width: 300 }} src={videoUrl} controls />
        <DocLink>
          <p className="text-primary">{caption}</p>
        </DocLink>
      </div>
    )
  } else if (document.type === 'audio' && document.url) {
    const audioUrl = document.url
    return (
      <div>
        <AudioTrack url={audioUrl} />
        <DocLink>
          <p className="text-primary">{caption}</p>
        </DocLink>
      </div>
    )
  }
  return null
}
