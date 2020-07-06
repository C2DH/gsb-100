import React from 'react'
import Markdown from 'markdown-to-jsx'
import DocumentObject from './DocumentObject'

export default function ModuleTextObject({ module }) {
  return (
    <div>
      <DocumentObject
        document={module.object.document}
        caption={module.object.caption}
      />
      <Markdown>{module.text.content}</Markdown>
    </div>
  )
}
