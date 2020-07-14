import React from 'react'
import DocumentObject from './DocumentObject'

export default function ModuleObject({ module }) {
  return (
    <DocumentObject
      document={module.document}
      caption={module.caption ? module.caption : module.document.data.title}
      className="mt-3"
    />
  )
}
