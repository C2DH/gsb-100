import React from 'react'
import PerspectiveModule from '../PerspectiveModule'
import styles from './PerspectiveChapter.module.scss'

function PerspectiveChapter({ chapter }) {
  const { modules } = chapter.contents
  return (
    <div className={styles.Chapter}>
      <h4>{chapter.title}</h4>
      {modules.map((module, index) => (
        <PerspectiveModule key={index} module={module} />
      ))}
    </div>
  )
}

export default React.memo(PerspectiveChapter)
