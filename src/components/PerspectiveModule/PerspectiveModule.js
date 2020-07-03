import React from 'react'
import ModuleTextObject from './ModuleTextObject'
import ModuleText from './ModuleText'

export default function Module({ module }) {
  switch (module.module) {
    case 'text_object':
      return <ModuleTextObject module={module} />
    case 'text':
      return <ModuleText module={module} />
    default:
      return (
        <div>NOT IMPLEMENT {module.module}</div>
      )
  }
}