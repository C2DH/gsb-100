import React from 'react'
import LangLink from '../LangLink'
import { useLocation } from 'react-router-dom'
import { usePrefetchDocument } from '../../miller'

export default function DocumentObject({ obj }) {
  const location = useLocation()
  const prefetchDocument = usePrefetchDocument()

  if (obj.document.type === 'image') {
    const image = obj.document.data.resolutions?.preview?.url
    return (
      <div>
        <LangLink
          onClick={() => {
            prefetchDocument(obj.document.document_id)
          }}
          to={{
            pathname: `/documents/${obj.document.document_id}`,
            state: { background: location, modalDocument: obj.document },
          }}
        >
          <img
            alt={obj.document.data.title}
            src={image}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        </LangLink>
        <p className="text-primary">{obj.caption}</p>
      </div>
    )
  } else if (obj.document.type === 'video') {
    // TODO: Fix object video
    return null
  }
  return null
}
