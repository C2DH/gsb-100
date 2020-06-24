import React from 'react'
import DocumentGridItem from './DocumentGridItem'

export default function DocumentsGrid({ documents }) {
  return (
    <div className="d-flex justify-content-center">
      <div className="d-flex flex-wrap overflow-hidden">
        {documents.map((doc) => (
          <DocumentGridItem key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  )
}
