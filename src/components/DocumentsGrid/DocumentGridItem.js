import React from 'react'
import DocLink from '../DocLink'

function DocumentGridItem({ doc }) {
  const imageUrl =
    doc.data.resolutions?.thumbnail?.url ?? doc.attachment ?? doc.snapshot

  return (
    <div className="p-3">
      <div style={{ height: 67, width: 67 }}>
        <DocLink document={doc}>
          <img
            style={{ objectFit: 'cover' }}
            height={67}
            width={67}
            title={doc.title}
            alt={doc.title}
            src={imageUrl}
          />
        </DocLink>
      </div>
    </div>
  )
}

export default React.memo(DocumentGridItem)
