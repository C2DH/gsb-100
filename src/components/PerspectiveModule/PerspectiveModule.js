import React from 'react'
import ModuleTextObject from './ModuleTextObject'

export default function Module({ module }) {
  switch (module.module) {
    case 'text_object':
      return <ModuleTextObject module={module} />
    default:
      return (
        <div>NOT IMPLEMENT {module.module}</div>
      )
  }
}