import React from 'react'
import Markdown from 'markdown-to-jsx'
import classNames from 'classnames'
import DocumentObject from './DocumentObject'
import ModuleText from './ModuleText'

export default function ModuleTextObject({ module }) {
  return (
    <div className="d-flex flex-column">
      <Markdown
        className={classNames('indent my-2', {
          'order-1': module.layout === 'object-text',
        })}
      >
        {module.text.content}
      </Markdown>
      {module.object.document && (
        <DocumentObject
          document={module.object.document}
          caption={
            module.object.caption
              ? module.object.caption
              : module.object.document.data.title
          }
          className={classNames('mt-3', {
            'order-0': module.layout === 'object-text',
          })}
        />
      )}
    </div>
  )
}
