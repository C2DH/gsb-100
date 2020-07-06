import React, { useState } from 'react'
import ReactWaves from '@dschoon/react-waves'
import padStart from 'lodash/padStart'
import { Button } from 'reactstrap'
import { Pause, Play, Volume, Volume2 } from 'react-feather'
import styles from './AudioTrack.module.scss'

function fromSecondsToProgressStr(time) {
  const totalSeconds = Math.round(time)
  const seconds = totalSeconds % 60
  const minutes = (totalSeconds - seconds) / 60
  return `${padStart(minutes, 2, '0')}:${padStart(seconds, 2, '0')}`
}

export default function AudioTrack({ url }) {
  const [playing, setPlaying] = useState(false)
  const togglePlay = () => setPlaying((a) => !a)
  const [progress, setProgress] = useState(null)
  const [volume, setVolume] = useState(1)

  function handlePosChange(pos, wave) {
    const duration = wave.getDuration()
    const played = wave.getCurrentTime()
    if (parseInt(duration) === parseInt(played)) {
      setPlaying(false)
    }
    setProgress({
      duration: fromSecondsToProgressStr(duration),
      played: fromSecondsToProgressStr(played),
    })
  }

  const WavesExtras = () => (
    <div>
      <div className='d-flex align-items-center justify-content-center'>
        <Volume />
        <input
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          type="range"
          step="any"
          min={0}
          max={1}
        />
        <Volume2 />
      </div>
      <div className={styles.WavesProgress}>
        {progress && (
          <div>
            {progress.played} / {progress.duration}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className={styles.AudioTrack}>
      <div className="mr-3">
        <Button onClick={togglePlay}>{playing ? <Pause /> : <Play />}</Button>
      </div>
      <ReactWaves
        className={styles.Waves}
        audioFile={url}
        onPosChange={handlePosChange}
        options={{
          fillParent: true,
          barHeight: 2,
          barWidth: 3,
          cursorWidth: 10,
          cursorColor: 'rgba(0,0,0,0.2)',
          hideScrollbar: true,
          progressColor: '#00b37f',
          responsive: true,
          waveColor: '#D1D6DA',
        }}
        volume={volume}
        zoom={1}
        playing={playing}
      >
        <WavesExtras />
      </ReactWaves>
    </div>
  )
}
