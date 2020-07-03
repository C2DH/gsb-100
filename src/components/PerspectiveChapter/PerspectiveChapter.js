import React from 'react'
import PerspectiveModule from '../PerspectiveModule'

function PerspectiveChapter({ chapter }) {
  const { modules } = chapter.contents
  return (
    <div>
      <h4>{chapter.title}</h4>
      {modules.map((module, index) => (
        <PerspectiveModule key={index} module={module} />
      ))}
    </div>
  )
}

export default React.memo(PerspectiveChapter)
