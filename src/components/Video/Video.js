import React, { useState, useContext, useRef } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause, Maximize, Volume, Volume2 } from 'react-feather'
import screenfull from 'screenfull'
import styles from './Video.module.scss'

const ControlsContext = React.createContext(null)

const Controls = ({ show }) => {
  const {
    playing,
    played,
    togglePlay,
    seekTo,
    goFullScreen,
    volume,
    setVolume,
    extraProgress,
  } = useContext(ControlsContext)
  const seekLineRef = useRef()

  function handleClick(e) {
    const clientX = e.clientX
    const { left, width } = seekLineRef.current.getBoundingClientRect()
    const nextProgress = Math.min(
      Math.max(clientX - parseInt(left), 0) / width,
      1
    )
    seekTo(nextProgress)
  }

  return (
    <div
      className={styles.Controls}
      style={{ display: show ? undefined : 'none' }}
    >
      <div className={styles.PlayPause} onClick={togglePlay}>
        {playing ? <Pause /> : <Play />}
      </div>
      <div className={styles.Volume}>
        {volume === 0 ? <Volume /> : <Volume2 />}
        <input
          value={volume}
          onChange={(e) => setVolume(+e.target.value)}
          min={0}
          max={1}
          type="range"
          step="any"
        />
      </div>
      <div
        onClick={handleClick}
        className={styles.ProggressLine}
        ref={seekLineRef}
      >
        <div
          className={styles.ProggressPlayed}
          style={{ width: `${played * 100}%` }}
        />
        {extraProgress}
      </div>
      <div className={styles.fullScreen} onClick={goFullScreen}>
        <Maximize />
      </div>
    </div>
  )
}

const ExtraVideoOverlay = () => {
  const { extraVideoOverlay } = useContext(ControlsContext)
  return extraVideoOverlay || null
}

const Wrapper = React.forwardRef(
  ({ children, customControls, ...props }, ref) => {
    const [showControls, setShowControls] = useState(false)
    return (
      <div
        {...props}
        ref={ref}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {children}
        <Controls show={showControls || true} />
        <ExtraVideoOverlay />
      </div>
    )
  }
)

export default function Video({
  onReady,
  extraProgress = null,
  extraVideoOverlay = null,
  ...props
}) {
  const playerRef = useRef()
  const [playing, setPlaying] = useState(false)
  const togglePlay = () => setPlaying((a) => !a)
  const [progress, setProgress] = useState({
    played: 0,
    playedSeconds: 0,
  })
  const seekTo = (played) => {
    setProgress({ played, playedSeconds: null })
    playerRef.current.seekTo(played, 'fraction')
  }
  const [volume, setVolume] = useState(1)

  const goFullScreen = () => {
    const videoElement = playerRef.current.wrapper.querySelector('video')
    screenfull.request(videoElement)
  }

  const handleOnReady = () => {
    onReady && onReady(playerRef.current)
  }

  return (
    <div>
      <ControlsContext.Provider
        value={{
          playing,
          played: progress.played,
          togglePlay,
          seekTo,
          goFullScreen,
          volume,
          setVolume,
          extraProgress,
          extraVideoOverlay,
        }}
      >
        <ReactPlayer
          onReady={handleOnReady}
          ref={playerRef}
          volume={volume}
          progressInterval={200}
          className={styles.Player}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          wrapper={Wrapper}
          playing={playing}
          onProgress={setProgress}
          playsinline
          {...props}
        />
      </ControlsContext.Provider>
    </div>
  )
}
