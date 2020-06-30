import React, { useState, useMemo, useRef } from 'react'
import find from 'lodash/find'
import { useCacheStory } from '../../miller'
import Menu from '../../components/Menu'
import ReactPlayer from 'react-player'
import styles from './Outline.module.scss'
import { Button } from 'reactstrap'

const SeekLine = ({ index, progress, onSeek, title, subtitle }) => {
  const width = progress === null ? 0 : progress * 100 + '%'
  const seekLineRef = useRef()

  function handleClick(e) {
    const clientX = e.clientX
    const { left, width } = seekLineRef.current.getBoundingClientRect()
    const nextProgress = Math.min(
      Math.max(clientX - parseInt(left), 0) / width,
      1
    )
    onSeek(index, nextProgress)
  }

  return (
    <div className={styles.SeekLineContainer}>
      <div>{title}</div>
      <div ref={seekLineRef} onClick={handleClick} className={styles.SeekLine}>
        <div className={styles.SeekProgress} style={{ width }} />
      </div>
      <div>{subtitle}</div>
    </div>
  )
}

function convertStrToSeconds(str) {
  const [mins, secs] = str.split(':')
  return parseInt(mins) * 60 + parseInt(secs)
}

export default function Outline() {
  const [outlineStory] = useCacheStory('outline')
  const [outlineTheme] = useCacheStory('outline-1', {
    withChapters: true,
  })
  const chapters = outlineTheme.data.chapters

  const [chapterIndex, setChapterIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const togglePlay = () => setPlaying((a) => !a)
  const [progress, setProgress] = useState({
    played: 0,
    playedSeconds: 0,
  })
  const playerRef = useRef()

  const playingVideoUrl = useMemo(() => {
    const chapter = chapters[chapterIndex]
    const documentId = chapter.contents.modules[0].object.id
    const docVideo = find(chapter.documents, { document_id: documentId })
    return docVideo.data.translated_urls
  }, [chapterIndex, chapters])

  function handleSeek(index, progressFraction) {
    setChapterIndex(index)
    setProgress({
      played: progressFraction,
      playedSeconds: null, // Will auto set by my player
    })
    playerRef.current.seekTo(progressFraction, 'fraction')
  }

  const seekObjectsSeconds = useMemo(() => {
    const chapter = chapters[chapterIndex]
    const seekObjects = chapter.contents.modules[0].objects
    return seekObjects.map((o) => ({
      ...o,
      from: convertStrToSeconds(o.from),
      to: convertStrToSeconds(o.to),
    }))
  }, [chapterIndex, chapters])

  const playedSeconds = progress.playedSeconds

  const playingDocuementId = useMemo(() => {
    if (playedSeconds === null) {
      return null
    }
    const objInTime = find(
      seekObjectsSeconds,
      (o) => playedSeconds >= o.from && o.to <= playedSeconds
    )
    if (objInTime) {
      return objInTime.id
    }
    return null
  }, [seekObjectsSeconds, playedSeconds])

  console.log('SS', playedSeconds, seekObjectsSeconds, playingDocuementId)

  return (
    <div className={styles.PlayerPage}>
      <Menu />
      <div className={styles.PlayerWrapper}>
        <ReactPlayer
          className={styles.Player}
          ref={playerRef}
          onProgress={setProgress}
          onEnded={() => {
            if (chapterIndex + 1 < chapters.length) {
              setChapterIndex(chapterIndex + 1)
              playerRef.current.seekTo(0, 'fraction')
              setProgress({
                played: 0,
                playedSeconds: null,
              })
            }
          }}
          width="100%"
          height="100%"
          playing={playing}
          url={playingVideoUrl}
        />
      </div>
      <div className={styles.Controls}>
        <div className="mb-4">
          <Button onClick={togglePlay}>{playing ? 'STOP' : 'PLAY'}</Button>
        </div>
        <div className="d-flex">
          {chapters.map((chapter, i) => (
            <div
              key={i}
              className={
                styles.SeekContent +
                ' ' +
                (i > 2 ? styles.SeekContentBig : styles.SeekContentSmall)
              }
            >
              <SeekLine
                onSeek={handleSeek}
                index={i}
                title={chapter.data.title}
                subtitle={'1970-1977'}
                progress={i === chapterIndex ? progress.played : null}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
