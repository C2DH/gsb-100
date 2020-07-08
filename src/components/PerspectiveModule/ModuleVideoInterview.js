import React, { useState, useMemo } from 'react'
import find from 'lodash/find'
import Video from '../Video'
import { convertStrToSeconds } from '../../utils'

const Segments = React.memo(({ segments }) => {
  return segments.map((segment, i) => (
    <div
      key={i}
      style={{
        top: 0,
        position: 'absolute',
        left: `${segment.fromPercent}%`,
        right: `${100 - segment.toPercent}%`,
        height: '100%',
        borderLeft: '1px solid purple',
        borderRight: '1px solid purple',
      }}
    ></div>
  ))
})

const MiniPlayingDocument = React.memo(({ document }) => (
  <div
    style={{
      position: 'absolute',
      right: 20,
      top: 20,
      height: 200,
      width: 200,
      backgroundImage: `url(${document.data.resolutions.preview.url})`,
      backgroundSize: 'cover',
    }}
  />
))

export default function ModuleVideoInterview({ module }) {
  const [duration, setDuration] = useState(null)
  const [playedSeconds, setPlayedSeconds] = useState(null)

  function handleOnReady(player) {
    setDuration(player.getDuration())
  }

  const segments = useMemo(() => {
    if (duration === null) {
      return null
    }
    console.log(duration)
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

  const playingDocuement = useMemo(() => {
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
    <Video
      width={500}
      url={module.object.document.url}
      onReady={handleOnReady}
      onProgress={(p) => setPlayedSeconds(p.playedSeconds)}
      extraVideoOverlay={
        playingDocuement ? (
          <MiniPlayingDocument document={playingDocuement} />
        ) : null
      }
      extraProgress={segments ? <Segments segments={segments} /> : null}
    />
  )
}
