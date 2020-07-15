import React from 'react'
import Markdown from 'markdown-to-jsx'
import classNames from 'classnames'

export default function ModuleText({ module, className }) {
  return (
    <Markdown className={classNames('my-2', className)}>
      {module.text.content}
    </Markdown>
  )
}
