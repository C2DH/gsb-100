import React from 'react'
import Markdown from 'markdown-to-jsx'

export default function ModuleText({ module }) {
  return (
    <div>
      <Markdown>{module.text.content}</Markdown>
    </div>
  )
}
