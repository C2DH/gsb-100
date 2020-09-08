import React, { useState, useContext, useRef, useImperativeHandle } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause, Maximize, VolumeX, Volume2 } from 'react-feather'
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
    muted,
    setMuted,
    toggleMuted,
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
      <div className={styles.Volume} onClick={() => toggleMuted()}>
        {muted === true ? <VolumeX /> : <Volume2 />}
        {/*<input
          value={volume}
          onChange={(e) => setVolume(+e.target.value)}
          min={0}
          max={1}
          type="range"
          step="any"
        />*/}
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
        {/*TODO: show when player is ready*/}
        <Controls show={showControls || true} />
        <ExtraVideoOverlay />
      </div>
    )
  }
)

function Video({
  onReady,
  extraProgress = null,
  extraVideoOverlay = null,
  width = null,
  height = null,
  onProgress,
  ...props
}, ref) {
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
  const [muted, setMuted] = useState(false)
  const toggleMuted = () => setMuted((a) => !a)

  const goFullScreen = () => {
    const videoElement = playerRef.current.wrapper.querySelector('video')
    screenfull.request(videoElement)
  }

  const handleOnReady = () => {
    onReady && onReady(playerRef.current)
  }

  useImperativeHandle(ref, () => ({
    togglePlay,
    setPlaying,
  }))

  return (
    <ControlsContext.Provider
      value={{
        playing,
        played: progress.played,
        togglePlay,
        seekTo,
        goFullScreen,
        volume,
        setVolume,
        muted,
        setMuted,
        toggleMuted,
        extraProgress,
        extraVideoOverlay,
      }}
    >
      <ReactPlayer
        onReady={handleOnReady}
        ref={playerRef}
        volume={volume}
        muted={muted}
        progressInterval={200}
        className={styles.Player}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        wrapper={Wrapper}
        playing={playing}
        onProgress={(progress) => {
          setProgress(progress)
          onProgress && onProgress(progress)
        }}
        width={null}
        height={null}
        playsinline
        {...props}
      />
    </ControlsContext.Provider>
  )
}

export default React.forwardRef(Video)
