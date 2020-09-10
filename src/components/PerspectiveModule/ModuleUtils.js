import React from 'react'
import ReactMarkdown from 'react-markdown'
import { CornerLeftUp } from 'react-feather'

export const Caption = ({ caption }) => {
  return (
    <div className="d-flex align-items-start mt-2">
      <CornerLeftUp
        size="14px"
        color={'#00b37f'}
        className="flex-shrink-0"
      ></CornerLeftUp>
      <ReactMarkdown
        source={caption}
        className="ml-2 text-primary"
        skipHtml={true}
      ></ReactMarkdown>
    </div>
  )
}
