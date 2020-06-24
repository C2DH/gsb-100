import React from 'react'

export default function DocumentGridItem({ doc }) {
  const imageUrl =
    doc.data.resolutions?.medium?.url ?? doc.attachment ?? doc.snapshot

  return (
    <div className="p-3">
      <div style={{ height: 67, width: 67 }}>
        <img
          style={{ objectFit: 'cover' }}
          height={67}
          width={67}
          title={doc.title}
          alt={doc.title}
          src={imageUrl}
        />
      </div>
    </div>
  )
}