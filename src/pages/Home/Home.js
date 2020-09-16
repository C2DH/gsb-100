import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
import classNames from 'classnames'
import { Play, ArrowRight } from 'react-feather'
import { Transition } from 'react-spring/renderprops'
import { animated } from 'react-spring'
import Helmet from 'react-helmet'
import { useCacheStory, useCacheDocument } from '../../miller'
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
  const [showPlay, setShowPlay] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const toggleStart = () => {
    setShowPlay(false)
    setPlaying(true)
    setMuted(false)
    playerRef.current.seekTo(0, 'fraction')
  }

  const onEnded = () => {
    setShowPlay(true)
  }

  return (
    <React.Fragment>
      <Helmet>
        <html lang={i18n.language.split('_')[0]} />
        <title itemProp="name">{homeStory.data.title}</title>
      </Helmet>
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
                [styles.showSkip]: !muted,
              }
            )}
            role="button"
            aria-pressed="true"
            to="/outline"
          >
            {t('explore')}
            <ArrowRight size="1.1rem" className="ml-1"></ArrowRight>
          </LangLink>
        </div>
        <div className="d-block d-lg-none">
          <SwitchLanguageMobile></SwitchLanguageMobile>
        </div>
      </div>
    </React.Fragment>
  )
}
