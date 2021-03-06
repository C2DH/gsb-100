import React from 'react'
import ReactMarkdown from 'react-markdown'
import classNames from 'classnames'

export default function ModuleText({ module, className }) {
  return (
    <ReactMarkdown
      source={module.text.content}
      className={classNames('my-2', className)}
      skipHtml={true}
    ></ReactMarkdown>
  )
}
