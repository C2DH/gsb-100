import React, { useMemo, useState, Suspense } from 'react'
import { extent } from 'd3-array'
import { scaleTime } from 'd3-scale'
import * as d3TimeFormat from 'd3-time-format'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import findIndex from 'lodash/findIndex'
import { useCacheStory, usePrefetchStory } from '../../miller'
import Video from '../../components/Video'
import styles from './TimelineVideo.module.scss'

function PeriodVideo({ id, title }) {
  const [story] = useCacheStory(id)
  const videoUrl = story.contents?.modules?.[0]?.object?.document?.url ?? null
  return (
    <div className={styles.PeriodVideoBox}>
      <Video url={videoUrl} />
      {/*<div>{title}</div>*/}
    </div>
  )
}

function TimelineVideo({ periods, timelineDocs }) {
  const [activePeriod, setActivePeriod] = useState(null)
  const prefetchStory = usePrefetchStory()

  console.log(periods)

  const xScale = useMemo(
    () =>
      scaleTime()
        .domain(extent(timelineDocs, (d) => new Date(d.data.start_date)))
        .range([0, 100])
        .clamp(true),
    [timelineDocs]
  )

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
            onMouseLeave={() => setActivePeriod(null)}
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
                  <PeriodVideo id={period.id} title={period.data.title} />
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

/*<div
  onMouseEnter={() => {
    setOpenPeriodIndex(i)
    prefetchStory(periods[i].id)
  }}
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
</div>*/
