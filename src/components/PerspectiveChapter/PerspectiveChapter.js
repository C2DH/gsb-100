import React, { Suspense } from 'react'
import PerspectiveModule from '../PerspectiveModule'
import { useCacheStory } from '../../miller'
import styles from './PerspectiveChapter.module.scss'

function PerspectiveChapterContent({ chapterId }) {
  const [chapter] = useCacheStory(chapterId)
  const { modules } = chapter.contents
  return (
    <>
      <h3 className={`${styles.title} m-0 py-4`}>{chapter.data.title}</h3>
      {modules.map((module, index) => (
        <div className="my-4" key={index}>
          <PerspectiveModule module={module} />
        </div>
      ))}
    </>
  )
}

function PerspectiveChapter({ chapterId }) {
  return (
    <div
      className={`${styles.chapter} text-secondary px-4 pb-4 position-relative`}
    >
      <Suspense
        fallback={<h3 className="text-secondary">Loading ma chapter....</h3>}
      >
        <PerspectiveChapterContent chapterId={chapterId} />
      </Suspense>
    </div>
  )
}

export default React.memo(PerspectiveChapter)
