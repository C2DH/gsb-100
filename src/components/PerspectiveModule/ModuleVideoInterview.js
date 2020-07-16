import React, { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import find from 'lodash/find'
import { usePrefetchDocument } from '../../miller'
import LangLink from '../LangLink'
import Video from '../Video'
import { convertStrToSeconds } from '../../utils'
import { Caption, DocLink } from './ModuleUtils'
import styles from './PerspectiveModule.module.scss'

const Segments = React.memo(({ segments }) => {
  return segments.map((segment, i) => (
    <div
      key={i}
      style={{
        left: `${segment.fromPercent}%`,
      }}
      className={styles.segment}
    ></div>
  ))
})

const MiniPlayingDocument = React.memo(({ document }) => {
  const location = useLocation()
  const prefetchDocument = usePrefetchDocument()
  return (
    <LangLink
      onClick={() => {
        prefetchDocument(document.document_id)
      }}
      to={{
        pathname: `/documents/${document.document_id}`,
        state: { background: location, modalDocument: document },
      }}
      className={styles.miniDocLink}
    >
      <div
        style={{
          backgroundImage: `url(${document.data.resolutions.preview.url})`,
        }}
        className={`${styles.miniDoc} customCursor`}
      />
    </LangLink>
  )
})

export default function ModuleVideoInterview({ module }) {
  const [duration, setDuration] = useState(null)
  const [playedSeconds, setPlayedSeconds] = useState(null)
  const videoUrl = module.object.document.data.translated_urls
    ? module.object.document.data.translated_urls
    : module.object.document.url

  function handleOnReady(player) {
    setDuration(player.getDuration())
  }

  const segments = useMemo(() => {
    if (duration === null) {
      return null
    }
    return module.objects.map((o) => {
      const fromSeconds = convertStrToSeconds(o.from)
      const fromPercent = (fromSeconds / duration) * 100

      const toSeconds = convertStrToSeconds(o.to)
      const toPercent = (toSeconds / duration) * 100

      return {
        ...o,
        fromSeconds,
        fromPercent,
        toSeconds,
        toPercent,
      }
    })
  }, [module, duration])

  const playingDocument = useMemo(() => {
    if (playedSeconds === null) {
      return null
    }
    const objInTime = find(
      segments,
      (o) => playedSeconds >= o.fromSeconds && playedSeconds <= o.toSeconds
    )
    if (objInTime) {
      return objInTime.document
    }
    return null
  }, [segments, playedSeconds])

  return (
    <React.Fragment>
      <Video
        url={videoUrl}
        onReady={handleOnReady}
        onProgress={(p) => setPlayedSeconds(p.playedSeconds)}
        extraVideoOverlay={
          playingDocument ? (
            <MiniPlayingDocument document={playingDocument} />
          ) : null
        }
        extraProgress={segments ? <Segments segments={segments} /> : null}
      />
      {module.title && (
        <DocLink document={module.object.document}>
          <Caption caption={module.title}></Caption>
        </DocLink>
      )}
    </React.Fragment>
  )
}
