import React from 'react'
import Markdown from 'markdown-to-jsx'
import DocumentObject from './DocumentObject'

export default function ModuleTextObject({ module }) {
  return (
    <div>
      <DocumentObject obj={module.object} />
      <Markdown>{module.text.content}</Markdown>
    </div>
  )
}
