import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'
import classNames from 'classnames'
import { Play, Pause, VolumeX, Volume2 } from 'react-feather'
import { useCacheStory, useCacheDocument } from '../../miller'
import SwitchLanguage from '../../components/SwitchLanguage'
import MapHome from '../../components/MapHome'
import styles from './Home.module.scss'
import LangLink from '../../components/LangLink'

export default function Home() {
  const { t } = useTranslation()
  const [homeStory] = useCacheStory('home')
  const [document] = useCacheDocument(350) //HC forever
  const [showVideo, setShowVideo] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const togglePlay = () => setPlaying((a) => !a)
  const toggleMute = () => setVolume((v) => (v === 0 ? 1 : 0))

  return (
    <React.Fragment>
      <ReactPlayer
        className={styles.Player}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        url={document.data.translated_urls}
        playsinline
      />
      <div
        className={classNames(styles.mapContainer, {
          [styles.hide]: showVideo,
        })}
      >
        <MapHome setShowVideo={setShowVideo} setPlaying={setPlaying}></MapHome>
      </div>
      <div
        className={`${styles.wrapper} d-flex flex-column justify-content-between p-4`}
      >
        <div className="d-flex">
          <div>
            <h1>
              {homeStory.data.title.replace(/\s.*/, '')}
              <br></br>
              {homeStory.data.title.replace(/\S+\s/, '')}
            </h1>
            <h4 className={`text-primary`}>{homeStory.data.subtitle}</h4>
          </div>
          <div className="ml-auto">
            <SwitchLanguage></SwitchLanguage>
          </div>
        </div>
        <div className="d-flex justify-content-center position-relative">
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
              {volume === 0 ? <VolumeX /> : <Volume2 />}
            </button>
          </div>
          <LangLink id={styles.startLink} to="/outline">
            <div id={styles.start}>
              <p className="m-0 text-center text-uppercase">
                {t('click to start')}
              </p>
            </div>
          </LangLink>
        </div>
      </div>
    </React.Fragment>
  )
}
