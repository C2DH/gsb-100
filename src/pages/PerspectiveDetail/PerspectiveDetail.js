import React, { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { ParentSize } from '@vx/responsive'
import { useCacheStory } from '../../miller'
import PerspectiveChapter from '../../components/PerspectiveChapter'
import Menu from '../../components/Menu'
import LangLink from '../../components/LangLink'
import Timeline from '../../components/Timeline'
import styles from './PerspectiveDetail.module.scss'

export default function PerspectiveDetail() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const [theme] = useCacheStory(slug)
  const chaptersRef = useRef()

  const { chapters: chaptersIds } = theme.data

  const timelineDocs = theme.documents

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
    <React.Fragment>
      <Menu />
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <h1 className={`${styles.title} my-3`}>
              <LangLink to="/perspectives" className="mr-3">
                <ArrowLeft color="white"></ArrowLeft>
              </LangLink>
              {theme.data.title}
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="offset-md-4 col-md-7">
            <p className={styles.description}>{theme.data.abstract}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <p className={`m-0 text-primary text-capitalize line-before`}>
              {t('thematic timeline')}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.timelineContainer}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              {timelineDocs.length > 0 && (
                <ParentSize debounceTime={10}>
                  {({ width, height }) => (
                    <Timeline
                      documents={timelineDocs}
                      width={width}
                      height={height}
                    ></Timeline>
                  )}
                </ParentSize>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-100 d-flex flex-column overflow-hidden">
        <div className="container flex-shrink-0">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <p className={`m-0 text-primary text-capitalize line-before`}>
                {t('chapters')}
              </p>
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
          </div>
        </div>
        <div
          className={`${styles.chapters} d-flex flex-grow-1`}
          ref={chaptersRef}
        >
          {chaptersIds.map((chapterId) => (
            <div key={chapterId} className={`${styles.chapter} bg-gray h-100`}>
              <PerspectiveChapter chapterId={chapterId} />
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  )
}
