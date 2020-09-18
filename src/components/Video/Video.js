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
import { useTranslation } from 'react-i18next'
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
      className={classNames(styles.Controls, {
        [styles.controlsShow]: show,
      })}
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
  ({ children, customControls, playing, ...props }, ref) => {
    const videoContext = useContext(ControlsContext)
    const [showControls, setShowControls] = useState(true)
    const toggle = (show) => {
      if (!videoContext.playing) {
        setShowControls(true)
      } else {
        setShowControls(show)
      }
    }
    return (
      <div
        {...props}
        ref={ref}
        onMouseEnter={() => toggle(true)}
        onMouseLeave={() => toggle(false)}
      >
        {children}
        <Controls show={showControls} />
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
  const { i18n } = useTranslation()
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
  const [tracks, setTracks] = useState([])
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
      const lang = video.textTracks[i].language
      if (lang === i18n.language.split('_')[0]) {
        video.textTracks[i].mode = mode === 'showing' ? 'hidden' : 'showing'
      }
    }
    setShowSubtitle((a) => !a)
  }

  const selectSubtitle = (lang) => {
    const video = playerRef.current.wrapper.querySelector('video')
    for (var i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode =
        lang === video.textTracks[i].language ? 'showing' : 'hidden'
      video.textTracks[i].default =
        lang === video.textTracks[i].language ? true : false
    }
  }

  const handleOnReady = () => {
    onReady && onReady(playerRef.current)
    if (hasSub) {
      selectSubtitle(i18n.language.split('_')[0])
    }
  }

  useImperativeHandle(ref, () => ({
    togglePlay,
    setPlaying,
  }))

  useMemo(() => {
    if (props.tracks) {
      setTracks(
        props.tracks
          .filter((d) => d.type === 'vtt')
          .map((d) => {
            return {
              kind: 'subtitles',
              src: d.url,
              srcLang: d.language.split('_')[0],
            }
          })
      )
    }
  }, [props.tracks])

  useMemo(() => {
    playerRef.current && selectSubtitle(i18n.language.split('_')[0])
  }, [i18n.language, playerRef])

  const hasSub = useMemo(() => {
    return tracks?.length > 0 ? true : false
  }, [tracks])

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
        tracks,
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
        config={{
          file: {
            tracks: tracks,
          },
        }}
        {...props}
      />
    </ControlsContext.Provider>
  )
}

export default React.forwardRef(Video)
