import React, { useState, useMemo, useRef, useCallback } from 'react'
import find from 'lodash/find'
import ReactPlayer from 'react-player'
import { Play, Pause, VolumeX, Volume2 } from 'react-feather'
import { useCacheStory } from '../../miller'
import Menu from '../../components/Menu'
import PlayingDocument from '../../components/PlayingDocument'
import SeekLine from '../../components/SeekLine'
import { convertStrToSeconds } from '../../utils'
import styles from './Outline.module.scss'

// Give me a story and a time in seconds and i give
// you the current document now "playing"
function usePlayingDocument(story, playedSeconds) {
  // Memo the list of objects with from and to normalize as seconds
  const seekObjectsSeconds = useMemo(() => {
    const seekObjects = story.contents.modules[0].objects
    return seekObjects.map((o) => ({
      ...o,
      from: convertStrToSeconds(o.from),
      to: convertStrToSeconds(o.to),
    }))
  }, [story])

  // Memo only the id by searching from seeks array
  const playingDocuementId = useMemo(() => {
    if (playedSeconds === null) {
      return null
    }
    const objInTime = find(
      seekObjectsSeconds,
      (o) => playedSeconds >= o.from && playedSeconds <= o.to
    )
    if (objInTime) {
      return objInTime.id
    }
    return null
  }, [seekObjectsSeconds, playedSeconds])

  // Memo the doc: re find them only when id changes
  const playingDocuement = useMemo(() => {
    if (playingDocuementId === null) {
      return null
    }
    return find(story.documents, { document_id: playingDocuementId })
  }, [playingDocuementId, story])

  // Finally my doc
  return playingDocuement
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
  const [volume, setVolume] = useState(1)
  const toggleMute = () => setVolume((v) => (v === 0 ? 1 : 0))
  const [progress, setProgress] = useState({
    played: 0,
    playedSeconds: 0,
  })
  const playerRef = useRef()

  const chapter = chapters[chapterIndex]

  const playingVideoUrl = useMemo(() => {
    const documentId = chapter.contents.modules[0].object.id
    const docVideo = find(chapter.documents, { document_id: documentId })
    return docVideo.data.translated_urls
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
          volume={volume}
          width="100%"
          height="100%"
          playing={playing}
          url={playingVideoUrl}
          playsinline
        />
        {playingDocument && <PlayingDocument
          onClick={handlePlayingDocClick}
          document={playingDocument}
        />}
        <div className={`${styles.Controls} pb-3 px-5 position-relative`}>
          <div className="py-4 d-flex">
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
          <div className="d-flex">
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
        </div>
      </div>
    </div>
  )
}
