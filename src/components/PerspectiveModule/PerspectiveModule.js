import React from 'react'
import ModuleTextObject from './ModuleTextObject'
import ModuleText from './ModuleText'
import ModuleObject from './ModuleObject'
import ModuleVideoInterview from './ModuleVideoInterview'

export default function Module({ module }) {
  switch (module.module) {
    case 'text_object':
      return <ModuleTextObject module={module} />
    case 'text':
      return <ModuleText module={module} />
    case 'object':
      return <ModuleObject module={module} />
    case 'video_interview':
      return <ModuleVideoInterview module={module} />
    default:
      return (
        <div>NOT IMPLEMENT {module.module}</div>
      )
  }
}