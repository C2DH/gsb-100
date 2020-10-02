import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import find from 'lodash/find'
import classNames from 'classnames'
import ReactPlayer from 'react-player'
import { Play, Pause, VolumeX, Volume2, SkipForward } from 'react-feather'
import { Transition, Spring } from 'react-spring/renderprops'
import { animated } from 'react-spring'
import { useTranslation } from 'react-i18next'
import { useCacheStory } from '../../miller'
import Header from '../../components/Header'
import PlayingDocument from '../../components/PlayingDocument'
import SeekLine from '../../components/SeekLine'
import MenuResponsive from '../../components/MenuResponsive'
import styles from './Outline.module.scss'
import { convertStrToSeconds } from '../../utils'

// Give me a story and a time in seconds and i give
// you the current document now "playing"
function usePlayingDocument(story, playedSeconds) {
  // Memo the list of objects with from and to normalize as seconds
  const seekObjectsSeconds = useMemo(() => {
    const seekObjects = story.contents.modules[0].objects || []
    const seekSpeakers = story.contents.modules[0].speakers || []
    const seekDocs = [...seekObjects, ...seekSpeakers]
    return seekDocs.map((o) => ({
      ...o,
      from: convertStrToSeconds(o.from),
      to: convertStrToSeconds(o.to),
    }))
  }, [story])

  // Memo the doc searching from seeks array
  const playingDocument = useMemo(() => {
    if (playedSeconds === null) {
      return null
    }
    const objInTime = find(
      seekObjectsSeconds,
      (o) => playedSeconds >= o.from && playedSeconds <= o.to
    )
    if (objInTime) {
      return objInTime.document
    }
    return null
  }, [seekObjectsSeconds, playedSeconds])

  // Finally my doc
  return playingDocument
}

export default function Outline() {
  const { i18n } = useTranslation()
  const [outlineStory] = useCacheStory('outline')
  const [outlineTheme] = useCacheStory('outline-1', {
    withChapters: true,
  })
  const chapters = outlineTheme.data.chapters

  const [chapterIndex, setChapterIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const togglePlay = () => setPlaying((a) => !a)
  const [muted, setMuted] = useState(false)
  const [cue, setCue] = useState([])
  const toggleMute = () => setMuted((v) => !v)
  const [progress, setProgress] = useState({
    played: 0,
    playedSeconds: 0,
  })
  const playerRef = useRef()

  const chapter = chapters[chapterIndex]

  const setSubtitles = (e) => {
    const selected = e.target.activeCues[0]?.track.mode
    const subtitles = Array.from(e.target.activeCues).map((cue) => cue.text)
    if (selected !== 'hidden') {
      setCue(subtitles)
    }
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
    for (var i = 0; i < video?.textTracks.length; i++) {
      video.textTracks[i].mode =
        lang === video.textTracks[i].language ? 'showing' : 'hidden'
      video.textTracks[i].default =
        lang === video.textTracks[i].language ? true : false
    }
  }

  const [playingVideoUrl, tracks] = useMemo(() => {
    const documentId = chapter.contents.modules[0].object.id
    const docVideo = find(chapter.documents, { document_id: documentId })
    const tracks = docVideo.data.subtitles
      ?.filter((d) => d.type === 'vtt')
      .map((d) => {
        return {
          kind: 'metadata',
          src: d.url,
          srcLang: d.language.split('_')[0],
        }
      })

    return [docVideo.data.translated_urls, tracks]
  }, [chapter])

  const playingDocument = usePlayingDocument(chapter, progress.playedSeconds)

  const handleSeek = useCallback((index, progressFraction) => {
    setChapterIndex(index)
    setProgress({
      played: progressFraction,
      playedSeconds: null, // Will auto set by my player
    })
    playerRef.current.seekTo(progressFraction, 'fraction')
  }, [])

  const handlePlayingDocClick = useCallback(() => {
    setPlaying(false)
  }, [])

  const skipNext = () => {
    if (chapterIndex + 1 < chapters.length) {
      setChapterIndex(chapterIndex + 1)
      playerRef.current.seekTo(0, 'fraction')
      setProgress({
        played: 0,
        playedSeconds: null,
      })
      setCue([])
    }
  }

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
      <Header title={outlineStory.data.title}></Header>
      <div className={styles.PlayerPage}>
        <MenuResponsive
          level={'01'}
          title={outlineStory.data.title}
        ></MenuResponsive>
        <div className={styles.PlayerWrapper}>
          <ReactPlayer
            className={styles.Player}
            ref={playerRef}
            onProgress={setProgress}
            onEnded={skipNext}
            onReady={onReady}
            muted={muted}
            width="100%"
            height="100%"
            playing={playing}
            url={playingVideoUrl}
            onClick={() => {
              togglePlay()
            }}
            config={{
              file: {
                tracks: tracks,
              },
            }}
            playsinline
          />
          <Transition
            items={playingDocument}
            from={{ opacity: 0, transform: 'translateX(100%)' }}
            enter={{ opacity: 1, transform: 'translateX(0%)' }}
            leave={{ opacity: 0, transform: 'translateX(100%)' }}
          >
            {(playingDocument) =>
              playingDocument &&
              ((props) => (
                <PlayingDocument
                  onClick={handlePlayingDocClick}
                  document={playingDocument}
                  style={props}
                />
              ))
            }
          </Transition>
          <Transition
            items={playing}
            from={{ opacity: 0 }}
            enter={{ opacity: 0.75 }}
            leave={{ opacity: 0 }}
            trail={300}
          >
            {(playing) =>
              !playing &&
              ((props) => (
                <animated.div
                  className={classNames(
                    `${styles.playControl} btn btn-secondary`
                  )}
                  onClick={() => {
                    togglePlay()
                  }}
                  style={props}
                >
                  <Play size={30} />
                </animated.div>
              ))
            }
          </Transition>

          <div
            className={classNames(
              `${styles.Controls} pb-2 pb-lg-3 px-2 px-lg-5 position-relative`
            )}
          >
            <div
              className={`${styles.controlsWrapper} w-100 d-flex align-items-center`}
            >
              <div
                id={styles.playerControl}
                className="flex-grow-0 flex-shrink-0 py-2 py-lg-4 d-none d-lg-flex justify-content-center justify-content-lg-start"
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
                  onClick={skipNext}
                >
                  <SkipForward />
                </button>
                <button
                  type="button"
                  className="ml-3 btn btn-light btn-icon-round opacity-75"
                  onClick={toggleMute}
                >
                  {muted === true ? <VolumeX /> : <Volume2 />}
                </button>
              </div>
              <div
                className={`${styles.subtitles} d-block d-lg-flex justify-content-center mb-2 py-2 py-lg-0 px-2 px-lg-4 flex-grow-1 flex-shrink-1`}
              >
                {cue.map((sub, index) => (
                  <p key={index}>{sub}</p>
                ))}
              </div>
            </div>
            <Spring
              from={{ transform: 'translateY(100%)' }}
              to={{ transform: 'translateY(0%)' }}
            >
              {(props) => (
                <div
                  style={props}
                  className="d-flex flex-column flex-lg-row flex-grow-0 flex-shrink-1 pt-2 pt-lg-0"
                >
                  {chapters.map((chapter, i) => (
                    <SeekLine
                      key={i}
                      onSeek={handleSeek}
                      index={i}
                      title={chapter.data.title}
                      abstract={chapter.data.abstract}
                      progress={i === chapterIndex ? progress.played : null}
                    />
                  ))}
                </div>
              )}
            </Spring>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
