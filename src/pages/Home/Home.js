import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
import classNames from 'classnames'
import { Play, Pause, VolumeX, Volume2, ArrowRight } from 'react-feather'
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
  const [showVideo, setShowVideo] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [showBg, setshowBg] = useState(false)
  const togglePlay = () => {
    setPlaying((a) => !a)
    setshowBg((a) => !a)
  }
  const toggleMute = () => setMuted((v) => !v)
  const onEnded = () => {
    togglePlay()
    setshowBg(true)
  }

  return (
    <React.Fragment>
      <ReactPlayer
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
        <MapHome setShowVideo={setShowVideo} setPlaying={setPlaying}></MapHome>
      </div>
      <div
        className={classNames(
          `${styles.wrapper} d-flex flex-column justify-content-between p-0 p-lg-4`,
          {
            [styles.bgWrapper]: showBg,
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
        <div className="d-flex justify-content-between justify-content-lg-center position-relative p-4 p-lg-0 mt-auto mt-lg-0">
          <LangLink
            className="btn btn-primary d-flex align-items-center d-lg-none text-uppercase"
            role="button"
            aria-pressed="true"
            to="/outline"
          >
            {t('start')}
            <ArrowRight size="1.1rem" className="ml-1"></ArrowRight>
          </LangLink>
          <div
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
          </LangLink>
        </div>
        <div className="d-block d-lg-none">
          <SwitchLanguageMobile></SwitchLanguageMobile>
        </div>
      </div>
    </React.Fragment>
  )
}
