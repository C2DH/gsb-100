import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
import classNames from 'classnames'
import { Volume2, ArrowRight, RotateCw } from 'react-feather'
import { Transition } from 'react-spring/renderprops'
import { animated } from 'react-spring'
import { useCacheStory, useCacheDocument } from '../../miller'
import Header from '../../components/Header'
import SwitchLanguage from '../../components/SwitchLanguage'
import SwitchLanguageMobile from '../../components/SwitchLanguageMobile'
import MapHome from '../../components/MapHome'
import styles from './Home.module.scss'
import LangLink from '../../components/LangLink'

export default function Home() {
  const { t, i18n } = useTranslation()
  const [homeStory] = useCacheStory('home')
  const [document] = useCacheDocument(350) //HC forever
  const playerRef = useRef()
  const [showVideo, setShowVideo] = useState(false)
  const [iconReplay, setIconReplay] = useState(false)
  const [cue, setCue] = useState([])
  const [showPlay, setShowPlay] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [zoomed, setZoomed] = useState(false)
  const toggleStart = () => {
    setShowPlay(false)
    setPlaying(true)
    setMuted(false)
    playerRef.current.seekTo(0, 'fraction')
  }

  const setSubtitles = (e) => {
    const selected = e.target.activeCues[0]?.track.mode
    const subtitles = Array.from(e.target.activeCues).map((cue) => cue.text)
    if (selected !== 'hidden') {
      setCue(subtitles)
    }
  }

  const onEnded = () => {
    setShowPlay(true)
    setIconReplay(true)
  }

  const onReady = () => {
    selectSubtitle(i18n.language.split('_')[0])
    const video = playerRef.current.wrapper.querySelector('video')
    for (var i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].addEventListener('cuechange', setSubtitles)
    }
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

  const tracks = useMemo(() => {
    return document.data.subtitles
      ?.filter((d) => d.type === 'vtt')
      .map((d) => {
        return {
          kind: 'metadata',
          src: d.url,
          srcLang: d.language.split('_')[0],
        }
      })
  }, [document])

  useEffect(() => {
    if (zoomed) {
      setShowVideo(true)
      setPlaying(true)
      setShowPlay(true)
    }
  }, [zoomed])

  useMemo(() => {
    playerRef.current && selectSubtitle(i18n.language.split('_')[0])
  }, [i18n.language, playerRef])

  useEffect(() => {
    const video = playerRef.current.wrapper.querySelector('video')
    return () => {
      if (video) {
        for (var i = 0; i < video.textTracks.length; i++) {
          video.textTracks[i].removeEventListener('cuechange', setSubtitles)
        }
      }
    }
  })

  return (
    <React.Fragment>
      <Header title={homeStory.data.title}></Header>
      <ReactPlayer
        ref={playerRef}
        className={styles.Player}
        width="100%"
        height="100%"
        playing={playing}
        volume={1}
        url={document.data.translated_urls}
        playsinline
        muted={muted}
        onEnded={onEnded}
        onReady={onReady}
        config={{
          file: {
            tracks: tracks,
          },
        }}
      />
      <div
        className={classNames(styles.mapContainer, {
          [styles.hide]: showVideo,
        })}
      >
        <MapHome setZoomed={setZoomed}></MapHome>
      </div>
      <div
        className={classNames(
          `${styles.wrapper} d-flex flex-column justify-content-between p-0 p-lg-4`,
          {
            [styles.bgWrapper]: showPlay,
          }
        )}
      >
        <div className="d-flex p-4 p-lg-0">
          <div>
            <h1>
              {homeStory.data.title.replace(/\s.*/, '')}
              <br></br>
              {homeStory.data.title.replace(/\S+\s/, '')}
            </h1>
            <h4 className={`text-primary`}>{homeStory.data.subtitle}</h4>
          </div>
          <div className="ml-auto d-none d-lg-block">
            <SwitchLanguage></SwitchLanguage>
          </div>
        </div>
        <Transition
          items={showPlay}
          from={{ opacity: 0 }}
          enter={{ opacity: 0.75 }}
          leave={{ opacity: 0 }}
        >
          {(showPlay) =>
            showPlay &&
            ((props) => (
              <animated.div
                className={classNames(
                  `${styles.playControl} btn btn-secondary`
                )}
                onClick={() => {
                  toggleStart()
                }}
                style={props}
              >
                {iconReplay ? (
                  <RotateCw size={30}></RotateCw>
                ) : (
                  <Volume2 size={30} />
                )}
              </animated.div>
            ))
          }
        </Transition>
        <div className={`${styles.subtitles} mt-auto mb-2 px-4`}>
          {cue.map((sub, index) => (
            <p key={index}>{sub}</p>
          ))}
        </div>
        <div className="d-flex justify-content-between justify-content-lg-center position-relative px-4 pb-4 pb-lg-0">
          <LangLink
            className={classNames(
              'btn btn-primary d-flex align-items-center text-uppercase',
              styles.skip,
              {
                [styles.showSkip]: !muted,
              }
            )}
            role="button"
            aria-pressed="true"
            to="/outline"
          >
            {t('explore')}
            <ArrowRight size={16} className="ml-1"></ArrowRight>
          </LangLink>
        </div>
        <div className="d-block d-lg-none">
          <SwitchLanguageMobile></SwitchLanguageMobile>
        </div>
      </div>
    </React.Fragment>
  )
}
