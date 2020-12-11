import React, { useMemo, useState, Suspense, createRef, useRef } from 'react'
import { extent } from 'd3-array'
import { scaleTime } from 'd3-scale'
import classNames from 'classnames'
import { useCacheStory, usePrefetchStory } from '../../miller'
import Video from '../../components/Video'
import styles from './TimelineVideo.module.scss'

const PeriodVideo = React.forwardRef(({ id, title }, ref) => {
  const [story] = useCacheStory(id)
  const doc = story.contents?.modules?.[0]?.object?.document ?? null
  if (!doc) return null
  const videoUrl =
    doc.data.translated_urls && typeof doc.data.translated_urls === 'string'
      ? doc.data.translated_urls
      : doc.url
  return (
    <div className={styles.PeriodVideoBox}>
      <Video url={videoUrl} ref={ref} />
    </div>
  )
})

function TimelineVideo({ periods, timelineDocs }) {
  const [activePeriod, setActivePeriod] = useState(null)
  const prefetchStory = usePrefetchStory()

  const xScale = useMemo(
    () =>
      scaleTime()
        .domain(extent(timelineDocs, (d) => new Date(d.data.start_date)))
        .range([0, 100])
        .clamp(true),
    [timelineDocs]
  )

  // Lazy create multi ref
  const multiVideoRef = useRef({})
  function createVideoIdRef(id) {
    if (!multiVideoRef.current[id]) {
      multiVideoRef.current[id] = createRef()
    }
    return multiVideoRef.current[id]
  }

  return (
    <div
      className={`${styles.periodsContainer} w-100 d-flex my-2`}
      style={{ padding: '0 15px' }}
    >
      {periods.map((period, i) => {
        const end = new Date(period.data.abstract.split('-')[1])
        const start = new Date(period.data.abstract.split('-')[0])
        const fadeLeft = start.getTime() < xScale.domain()[0].getTime()
        const fadeRight = end.getTime() > xScale.domain()[1].getTime()
        const width = xScale(end) - xScale(start)
        let marginLeft = 0
        if (i === 0 && start.getTime() > xScale.domain()[0].getTime()) {
          marginLeft = xScale(start)
        }
        return (
          <div
            onMouseEnter={() => {
              setActivePeriod(period.id)
              prefetchStory(period.id)
            }}
            onMouseLeave={() => {
              setActivePeriod(null)
              const videoRef = multiVideoRef.current[period.id]
              if (videoRef) {
                videoRef.current.setPlaying(false)
              }
            }}
            key={i}
            className={classNames(styles.periodBlock, {
              [styles.active]: period.id === activePeriod,
            })}
            style={{
              width: `${width}%`,
              marginLeft: `${marginLeft}%`,
            }}
          >
            <p className={`${styles.videoTitle} text-truncate mb-1 pl-2`}>
              {period.data.title}
            </p>
            <div
              className={classNames(styles.periodLine, {
                [styles.periodFLR]: fadeLeft && fadeRight,
                [styles.periodFL]: fadeLeft && !fadeRight,
                [styles.periodFR]: fadeRight && !fadeLeft,
              })}
            ></div>
            <div className={styles.videoContainer}>
              <div className={styles.video}>
                <Suspense>
                  <PeriodVideo
                    ref={createVideoIdRef(period.id)}
                    id={period.id}
                    title={period.data.title}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TimelineVideo
