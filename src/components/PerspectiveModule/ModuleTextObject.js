import React from 'react'
import Markdown from 'markdown-to-jsx'
import DocumentObject from './DocumentObject'

export default function ModuleTextObject({ module }) {
  if (module.layout === 'text-object') {
    return (
      <div>
        <Markdown>{module.text.content}</Markdown>
        {module.document && (
          <DocumentObject
            document={module.object.document}
            caption={module.object.caption}
          />
        )}
      </div>
    )
  } else {
    return (
      <div>
        {module.document && <DocumentObject
          document={module.object.document}
          caption={module.object.caption}
        />}
        <Markdown>{module.text.content}</Markdown>
      </div>
    )
  }
}
