import React, { useRef } from 'react'
import Menu from '../../components/Menu'
import { useParams } from 'react-router-dom'
import { useCacheStory } from '../../miller'
import styles from './PerspectiveDetail.module.scss'
import PerspectiveChapter from '../../components/PerspectiveChapter'
import { ArrowLeft, ArrowRight } from 'react-feather'

export default function PerspectiveDetail() {
  const { slug } = useParams()
  const [theme] = useCacheStory(slug)
  const chaptersRef = useRef()

  const { chapters: chaptersIds } = theme.data

  function getChapterWidth() {
    const container = chaptersRef.current
    const width = container.clientWidth
    const chapterWidth = width * 0.4 + 2 // CSS width: 40% + 1px border x side
    return chapterWidth
  }
  function handleScrollBackChapter() {
    const container = chaptersRef.current
    const chapterWidth = getChapterWidth()
    const currentChapterIndex = Math.ceil(container.scrollLeft / chapterWidth)
    container.scrollTo(Math.max(currentChapterIndex - 1, 0) * chapterWidth, 0)
  }
  function handleScrollNextChapter() {
    const container = chaptersRef.current
    const chapterWidth = getChapterWidth()
    const currentChapterIndex = Math.floor(container.scrollLeft / chapterWidth)
    container.scrollTo(
      Math.min(currentChapterIndex + 1, chaptersIds.length - 1) * chapterWidth,
      0
    )
  }

  return (
    <div>
      <Menu />
      <h1>{theme.data.title}</h1>
      <p>{theme.data.abstract}</p>

      <div className="d-flex justify-content-end">
        <div>
          <button
            className="btn bg-transparent text-white"
            onClick={handleScrollBackChapter}
          >
            <ArrowLeft />
          </button>
          <button
            className="btn bg-transparent text-white"
            onClick={handleScrollNextChapter}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
      <div className={styles.Chapters} ref={chaptersRef}>
        {chaptersIds.map((chapterId) => (
          <div key={chapterId} className={styles.Chapter}>
            <PerspectiveChapter chapterId={chapterId} />
          </div>
        ))}
      </div>
    </div>
  )
}
