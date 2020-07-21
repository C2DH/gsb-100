import React, { useRef, useMemo, useState, Suspense } from 'react'
import classNames from 'classnames'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import sortBy from 'lodash/sortBy'
import findIndex from 'lodash/findIndex'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { ParentSize } from '@vx/responsive'
import { useCacheStory } from '../../miller'
import PerspectiveChapter from '../../components/PerspectiveChapter'
import Menu from '../../components/Menu'
import LangLink from '../../components/LangLink'
import Timeline from '../../components/Timeline'
import styles from './PerspectiveDetail.module.scss'
import { extent } from 'd3-array'
import Video from '../../components/Video'

function PeriodVideo({ id, title }) {
  const [story] = useCacheStory(id)
  const videoUrl = story.contents?.modules?.[0]?.object?.document?.url ?? null
  return (
    <div className={styles.PeriodVideoBox}>
      <Video url={videoUrl} />
      <div>{title}</div>
    </div>
  )
}

export default function PerspectiveDetail() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const [theme] = useCacheStory(slug)
  const [outlineTheme] = useCacheStory('outline-1')

  const chaptersRef = useRef()

  const { chapters: chaptersIds } = theme.data

  const periods = useMemo(() => {
    return sortBy(outlineTheme.stories, (s) =>
      Number(s.data.abstract.split('-')[0])
    ).slice(3)
  }, [outlineTheme])

  const timelineDocs = theme.documents

  const selectedPeriodIndex = useMemo(() => {
    const [, endDate] = extent(timelineDocs, (d) => new Date(d.data.start_date))
    const endYear = endDate ? endDate.getFullYear() : 0 // Z3r0 Don't make sense
    return findIndex(periods, (p) => {
      const [, endPeriodYear] = p.data.abstract.split('-').map(Number)
      return endYear <= endPeriodYear
    })
  }, [timelineDocs, periods])

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

  const [openPeriodIndex, setOpenPeriodIndex] = useState(null)

  return (
    <React.Fragment>
      <Menu />
      <div className="container">
        <div className="row">
          {periods.map((period, i) => (
            <div
              onMouseEnter={() => setOpenPeriodIndex(i)}
              onMouseLeave={() => setOpenPeriodIndex(null)}
              key={period.id}
              className={classNames('col-md', styles.Period, {
                'ml-3': i > 0,
                [styles.SelectedPeriod]: selectedPeriodIndex === i,
              })}
            >
              <div>{period.data.abstract}</div>
              <div className={styles.PeriodLine} />
              <div className={styles.PeriodVideoContainer}>
                {openPeriodIndex === i && (
                  <Suspense
                    fallback={
                      <div className={styles.PeriodVideoBox}>
                        {period.data.title}
                      </div>
                    }
                  >
                    <PeriodVideo id={period.id} title={period.data.title} />
                  </Suspense>
                )}
              </div>
            </div>
          ))}
        </div>
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
