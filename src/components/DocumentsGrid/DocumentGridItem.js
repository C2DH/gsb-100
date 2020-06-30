import React from 'react'
import { useLocation } from 'react-router-dom'
import { usePrefetchDocument } from '../../miller'
import LangLink from '../LangLink'

function DocumentGridItem({ doc }) {
  const location = useLocation()
  const prefetchDocument = usePrefetchDocument()
  const imageUrl =
    doc.data.resolutions?.medium?.url ?? doc.attachment ?? doc.snapshot

  return (
    <div className="p-3">
      <div style={{ height: 67, width: 67 }}>
        <LangLink
          to={{
            pathname: `/documents/${doc.id}`,
            state: { background: location, modalDocument: doc },
          }}
          onClick={() => prefetchDocument(doc.id)}
        >
          <img
            style={{ objectFit: 'cover' }}
            height={67}
            width={67}
            title={doc.title}
            alt={doc.title}
            src={imageUrl}
          />
        </LangLink>
      </div>
    </div>
  )
}

export default React.memo(DocumentGridItem)
