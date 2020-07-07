import React, { useState, useMemo } from 'react'
import Video from '../Video'
import { convertStrToSeconds } from '../../utils'

export default function ModuleVideoInterview({ module }) {
  const [duration, setDuration] = useState(null)
  console.log('Interview ma men', module)

  function handleOnReady(player) {
    console.log('MA player', player)
    setDuration(player.getDuration())
  }

  const segments = useMemo(() => {
    if (duration === null) {
      return null
    }
    console.log(duration)
    return module.objects.map((o) => {
      const fromPercent = (convertStrToSeconds(o.from) / duration) * 100
      const toPercent = (convertStrToSeconds(o.to) / duration) * 100
      return {
        ...o,
        fromPercent,
        toPercent,
      }
    })
  }, [module, duration])
  console.log(segments)

  return (
    <Video
      width={500}
      url={module.object.document.url}
      onReady={handleOnReady}
      extraVideoOverlay={(
        <div style={{
          position: 'absolute',
          right: 20,
          background: 'red',
          top: 20,
          height: 50,
          width: 50
        }}>DOC HERE</div>
      )}
      extraProgress={
        segments ? (
          <>
            {segments.map((segment, i) => (
              <div
                key={i}
                style={{
                  top: 0,
                  position: 'absolute',
                  left: `${segment.fromPercent}%`,
                  right: `${100 - segment.toPercent}%`,
                  height: '100%',
                  borderLeft: '1px solid purple',
                  borderRight: '1px solid purple'
                }}
              ></div>
            ))}
          </>
        ) : null
      }
    />
  )
}
