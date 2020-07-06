import React from 'react'
import DocumentObject from './DocumentObject'

export default function ModuleObject({ module }) {
  return (
    <div>
      <DocumentObject
        document={module.document}
        caption={module.caption}
      />
    </div>
  )
}
