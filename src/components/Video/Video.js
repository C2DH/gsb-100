import React, {
  useState,
  useContext,
  useRef,
  useImperativeHandle,
  useMemo,
} from 'react'
import ReactPlayer from 'react-player'
import {
  Play,
  Pause,
  Maximize,
  VolumeX,
  Volume2,
  AlignCenter,
} from 'react-feather'
import classNames from 'classnames'
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
    toggleMuted,
    extraProgress,
    toggleSubtitle,
    showSubtitle,
    hasSub,
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
      <div className={styles.controlIcon} onClick={goFullScreen}>
        <Maximize />
      </div>

      {hasSub && (
        <div
          className={classNames(styles.controlIcon, {
            [styles.disabled]: !showSubtitle,
          })}
          onClick={toggleSubtitle}
        >
          <AlignCenter />
        </div>
      )}
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

function Video(
  {
    onReady,
    extraProgress = null,
    extraVideoOverlay = null,
    width = null,
    height = null,
    onProgress,
    onPlay,
    onPause,
    ...props
  },
  ref
) {
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
  const [showSubtitle, setShowSubtitle] = useState(true)
  const toggleMuted = () => setMuted((a) => !a)

  const goFullScreen = () => {
    const videoElement = playerRef.current.wrapper.querySelector('video')
    if (screenfull.isEnabled) {
      screenfull.request(videoElement)
    }
  }

  const toggleSubtitle = () => {
    const video = playerRef.current.wrapper.querySelector('video')
    for (var i = 0; i < video.textTracks.length; i++) {
      const mode = video.textTracks[i].mode
      video.textTracks[i].mode = mode === 'showing' ? 'hidden' : 'showing'
    }
    setShowSubtitle((a) => !a)
  }

  const moveSubtitles = () => {
    const track = playerRef.current.wrapper.querySelector('track')
    const cues = track.track.cues
    for (var i = 0; i < cues.length; i++) {
      cues[i].line = -4
    }
  }

  const handleOnReady = () => {
    onReady && onReady(playerRef.current)
    hasSub && moveSubtitles()
  }

  useImperativeHandle(ref, () => ({
    togglePlay,
    setPlaying,
  }))

  const config = useMemo(() => {
    if (props.sub?.url) {
      return {
        file: {
          tracks: [
            {
              kind: 'subtitles',
              src: props.sub.url,
              srcLang: props.sub.lang,
              default: true,
            },
          ],
        },
      }
    }
  }, [props.sub])

  const hasSub = useMemo(() => {
    return props.sub?.url ? true : false
  }, [props.sub])

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
        toggleSubtitle,
        showSubtitle,
        hasSub,
      }}
    >
      <ReactPlayer
        onReady={handleOnReady}
        ref={playerRef}
        volume={volume}
        muted={muted}
        progressInterval={200}
        className={styles.Player}
        onPause={() => {
          setPlaying(false)
          onPause && onPause()
        }}
        onPlay={() => {
          setPlaying(true)
          onPlay && onPlay()
        }}
        wrapper={Wrapper}
        playing={playing}
        onProgress={(progress) => {
          setProgress(progress)
          onProgress && onProgress(progress)
        }}
        width={null}
        height={null}
        playsinline
        config={config}
        {...props}
      />
    </ControlsContext.Provider>
  )
}

export default React.forwardRef(Video)
