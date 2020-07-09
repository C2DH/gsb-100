import React, { Suspense } from 'react'
import PerspectiveModule from '../PerspectiveModule'
import styles from './PerspectiveChapter.module.scss'
import { useCacheStory } from '../../miller'

function PerspectiveChapterContent({ chapterId }) {
  const [chapter] = useCacheStory(chapterId)
  const { modules } = chapter.contents
  return (
    <>
      <h4>{chapter.title}</h4>
      {modules.map((module, index) => (
        <PerspectiveModule key={index} module={module} />
      ))}
    </>
  )
}

function PerspectiveChapter({ chapterId }) {
  return (
    <div className={styles.Chapter}>
      <Suspense
        fallback={<h3 className="text-secondary">Loading ma chapter....</h3>}
      >
        <PerspectiveChapterContent chapterId={chapterId} />
      </Suspense>
    </div>
  )
}

export default React.memo(PerspectiveChapter)
