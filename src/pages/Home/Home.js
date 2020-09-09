import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
import classNames from 'classnames'
import { Play, Pause, VolumeX, Volume2, ArrowRight } from 'react-feather'
import { Transition } from 'react-spring/renderprops'
import { animated } from 'react-spring'
import { useCacheStory, useCacheDocument } from '../../miller'
import SwitchLanguage from '../../components/SwitchLanguage'
import SwitchLanguageMobile from '../../components/SwitchLanguageMobile'
import MapHome from '../../components/MapHome'
import styles from './Home.module.scss'
import LangLink from '../../components/LangLink'

export default function Home() {
  const { t } = useTranslation()
  const [homeStory] = useCacheStory('home')
  const [document] = useCacheDocument(350) //HC forever
  const playerRef = useRef()
  const [showVideo, setShowVideo] = useState(false)
  const [showPlay, setShowPlay] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [showSkip, setshowSkip] = useState(false)
  const toggleStart = () => {
    playerRef.current.seekTo(0, 'fraction')
    if (!playing) {
      setPlaying(true)
    }
    setMuted(false)
    setShowPlay(false)
    setshowSkip(true)
  }

  const onEnded = () => {
    setShowPlay(true)
  }

  return (
    <React.Fragment>
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
      />
      <div
        className={classNames(styles.mapContainer, {
          [styles.hide]: showVideo,
        })}
      >
        <MapHome
          setShowVideo={setShowVideo}
          setPlaying={setPlaying}
          setShowPlay={setShowPlay}
        ></MapHome>
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
                <Play size={30} />
              </animated.div>
            ))
          }
        </Transition>
        <div className="d-flex justify-content-between justify-content-lg-center position-relative p-4 p-lg-0 mt-auto mt-lg-0">
          <LangLink
            className={classNames(
              'btn btn-primary d-flex align-items-center text-uppercase',
              styles.skip,
              {
                [styles.showSkip]: showSkip,
              }
            )}
            role="button"
            aria-pressed="true"
            to="/outline"
          >
            {t('start')}
            <ArrowRight size="1.1rem" className="ml-1"></ArrowRight>
          </LangLink>
          {/*<div
            className={classNames(styles.playerControls, {
              [styles.show]: showVideo,
            })}
          >
            <button
              type="button"
              className="ml-2 btn btn-light btn-icon-round opacity-75"
              onClick={togglePlay}
            >
              {playing ? <Pause /> : <Play />}
            </button>
            <button
              type="button"
              className="ml-3 btn btn-light btn-icon-round opacity-75"
              onClick={toggleMute}
            >
              {muted ? <VolumeX /> : <Volume2 />}
            </button>
          </div>
          <LangLink
            id={styles.startLink}
            to="/outline"
            className="d-none d-lg-flex"
          >
            <div id={styles.start}>
              <p className="m-0 text-center text-uppercase">
                {t('click to start')}
              </p>
            </div>
          </LangLink>*/}
        </div>
        <div className="d-block d-lg-none">
          <SwitchLanguageMobile></SwitchLanguageMobile>
        </div>
      </div>
    </React.Fragment>
  )
}
