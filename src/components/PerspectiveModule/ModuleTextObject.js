import React from 'react'
import classNames from 'classnames'
import DocumentObject from './DocumentObject'
import ModuleText from './ModuleText'

export default function ModuleTextObject({ module }) {
  return (
    <div className="d-flex flex-column">
      <ModuleText
        module={module}
        className={classNames({
          'order-1': module.layout === 'object-text',
        })}
      ></ModuleText>
      {module.object.document && (
        <DocumentObject
          document={module.object.document}
          caption={
            module.object.caption
              ? module.object.caption
              : module.object.document.data.title
          }
          className={classNames('my-3', {
            'order-0': module.layout === 'object-text',
          })}
        />
      )}
    </div>
  )
}
