import React from 'react'
import Markdown from 'markdown-to-jsx'

export default function ModuleText({ module }) {
  return <Markdown className="indent my-2">{module.text.content}</Markdown>
}
