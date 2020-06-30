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
    <div>
      <div>{title}</div>
      <div ref={seekLineRef} onClick={handleClick} className={styles.SeekLine}>
        <div className={styles.SeekProgress} style={{ width }} />
      </div>
      <div>{subtitle}</div>
    </div>
  )
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
  const [progress, setProgress] = useState(0)
  const playerRef = useRef()

  const playingVideoUrl = useMemo(() => {
    const chapter = chapters[chapterIndex]
    const documentId = chapter.contents.modules[0].object.id
    const docVideo = find(chapter.documents, { document_id: documentId })
    const videoUrl = docVideo.data.translated_urls
    return videoUrl
  }, [chapterIndex, chapters])

  function handleSeek(index, progress) {
    setChapterIndex(index)
    setProgress(progress)
    playerRef.current.seekTo(progress, 'fraction')
  }

  return (
    <div className={styles.PlayerPage}>
      <Menu />
      <div className={styles.PlayerWrapper}>
        <ReactPlayer
          className={styles.Player}
          ref={playerRef}
          onProgress={(p) => setProgress(p.played)}
          onEnded={() => {
            if (chapterIndex + 1 < chapters.length) {
              setChapterIndex(chapterIndex + 1)
              playerRef.current.seekTo(0, 'fraction')
              setProgress(0)
            }
          }}
          width="100%"
          height="100%"
          playing={playing}
          url={playingVideoUrl}
        />
      </div>
      <div className={styles.Controls}>
        <div className='mb-4'>
          <Button onClick={togglePlay}>{playing ? 'STOP' : 'PLAY'}</Button>
        </div>
        <div className="d-flex">
          {chapters.map((chapter, i) => (
            <div
              key={i}
              className={i > 2 ? styles.SeekContentBig : styles.SeekContent}
            >
              <SeekLine
                onSeek={handleSeek}
                index={i}
                title={chapter.data.title}
                subtitle={'1970-1977'}
                progress={i === chapterIndex ? progress : null}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
