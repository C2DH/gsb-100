import React, { useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import sortBy from 'lodash/sortBy'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { ParentSize } from '@vx/responsive'
import Media from 'react-media'
import { Spring, config } from 'react-spring/renderprops'
import { useCacheStory } from '../../miller'
import PerspectiveChapter from '../../components/PerspectiveChapter'
import MenuResponsive from '../../components/MenuResponsive'
import LangLink from '../../components/LangLink'
import Timeline from '../../components/Timeline'
import TimelineMobile from '../../components/TimelineMobile'
import TimelineVideo from '../../components/TimelineVideo'
import { BREAKPOINTS } from '../../utils'
import styles from './PerspectiveDetail.module.scss'

export default function PerspectiveDetail() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const [theme] = useCacheStory(slug)
  const [outlineTheme] = useCacheStory('outline-1')
  const [perspectivesStory] = useCacheStory('perspectives')

  const chaptersRef = useRef()

  const { chapters: chaptersIds } = theme.data

  const periods = useMemo(() => {
    return sortBy(outlineTheme.stories, (s) =>
      Number(s.data.abstract.split('-')[0])
    ).slice(3)
  }, [outlineTheme])

  const timelineDocs = theme.documents

  function getChapterWidth() {
    const container = chaptersRef.current
    const width = container.clientWidth
    const paddingLeft = parseInt(getComputedStyle(container).paddingLeft)
    const chapterWidth = (width - paddingLeft) * 0.4 + 2 // CSS width: 40% + 1px border x side
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
      <Helmet>
        <html lang={i18n.language.split('_')[0]} />
        <title itemProp="name">
          {perspectivesStory.data.title} - {theme.data.title}
        </title>
      </Helmet>
      <div className={styles.perspectiveDetailCont}>
        <MenuResponsive
          level={'02'}
          title={perspectivesStory.data.title}
        ></MenuResponsive>
        <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={config.slow}>
          {(props) => (
            <div style={props} className="container">
              <div className="row">
                <div className="col-12 col-lg-9">
                  <h1 className={`${styles.title} my-3 my-lg-5`}>
                    <LangLink to="/perspectives" className="mr-3">
                      <ArrowLeft color="white"></ArrowLeft>
                    </LangLink>
                    {theme.data.title}
                  </h1>
                </div>
              </div>
              <div className="row">
                <div className="offset-1 col-11 offset-md-2 col-md-10 offset-lg-4 col-lg-7">
                  <p className={styles.description}>{theme.data.abstract}</p>
                </div>
              </div>
            </div>
          )}
        </Spring>
        <Spring
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
          config={{ delay: 400, tension: 280, friction: 60 }}
        >
          {(props) => (
            <React.Fragment>
              <div style={props} className="container">
                <div className="row">
                  <div className="col-12">
                    <p
                      className={`m-0 text-primary text-capitalize line-before`}
                    >
                      {t('thematic timeline')}
                    </p>
                  </div>
                </div>
              </div>
              <Media queries={BREAKPOINTS}>
                {(matches) =>
                  matches.sm ? (
                    <TimelineMobile documents={timelineDocs} style={props} />
                  ) : (
                    <div style={props} className={styles.timelineContainer}>
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <TimelineVideo
                              periods={periods}
                              timelineDocs={timelineDocs}
                            ></TimelineVideo>
                          </div>
                        </div>
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
                  )
                }
              </Media>
            </React.Fragment>
          )}
        </Spring>

        <Spring
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
          config={{ delay: 800, tension: 280, friction: 60 }}
        >
          {(props) => (
            <div
              style={props}
              className={`${styles.chaptersCont} d-flex flex-column`}
            >
              <div className="container flex-shrink-0">
                <div className="row">
                  <div className="col-12 d-flex justify-content-between align-items-center">
                    <p
                      className={`mb-2 m-md-0 text-primary text-capitalize line-before`}
                    >
                      {t('chapters')}
                    </p>
                    <div className="d-none d-lg-block">
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
                className={`${styles.chapters} d-flex flex-column flex-md-row flex-grow-0 flex-grow-md-1`}
                ref={chaptersRef}
              >
                {chaptersIds.map((chapterId) => (
                  <div key={chapterId} className={`${styles.chapter}`}>
                    <PerspectiveChapter chapterId={chapterId} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Spring>
      </div>
    </React.Fragment>
  )
}
