import React, { useState } from 'react'
import ReactWaves from '@dschoon/react-waves'
import { Pause, Play, Volume, Volume2 } from 'react-feather'

function fromSecondsToProgressStr(time) {
  const totalSeconds = Math.round(time)
  const seconds = totalSeconds % 60
  const minutes = (totalSeconds - seconds) / 60
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

export default function AudioTrack({ url, module }) {
  const [playing, setPlaying] = useState(false)
  const togglePlay = () => setPlaying((a) => !a)
  const [progress, setProgress] = useState({
    duration: '00:00',
    played: '00:00',
  })
  const [volume, setVolume] = useState(0.5)

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

  function handleLoaded({ wavesurfer }) {
    const duration = wavesurfer.getDuration()
    const played = wavesurfer.getCurrentTime()
    setProgress({
      duration: fromSecondsToProgressStr(duration),
      played: fromSecondsToProgressStr(played),
    })
  }

  return (
    <div className="w-100 d-flex align-items-center justify-content-center flex-column">
      <div className="w-100 d-flex">
        <div className="ml-auto">
          <p>
            {progress.played} / {progress.duration}
          </p>
        </div>
      </div>
      <div className="d-flex align-items-center w-100">
        <div className="mr-3">
          <button
            onClick={togglePlay}
            className="btn btn-light btn-icon-round opacity-75"
          >
            {playing ? <Pause /> : <Play />}
          </button>
        </div>
        <div className="w-100">
          <ReactWaves
            className="w-100 m-0 p-0"
            audioFile={url}
            onPosChange={handlePosChange}
            onReady={handleLoaded}
            options={{
              fillParent: true,
              barHeight: 10,
              barWidth: 3,
              cursorWidth: 0,
              cursorColor: 'rgba(0,0,0,0.2)',
              hideScrollbar: true,
              progressColor: '#00b37f',
              responsive: true,
              waveColor: '#7d7d7d',
            }}
            volume={volume}
            zoom={1}
            playing={playing}
          ></ReactWaves>
        </div>
      </div>
      {!module && (
        <div className="w-100 d-flex align-items-center justify-content-center mt-3 opacity-75">
          <Volume />
          <input
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            type="range"
            step="0.1"
            min={0}
            max={1}
            className="mx-1"
          />
          <Volume2 />
        </div>
      )}
    </div>
  )
}
