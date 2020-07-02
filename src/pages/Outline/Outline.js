import React, { useState, useMemo, useRef, useCallback } from "react";
import classNames from "classnames";
import find from "lodash/find";
import { useCacheStory } from "../../miller";
import Menu from "../../components/Menu";
import ReactPlayer from "react-player";
import styles from "./Outline.module.scss";
import { Button } from "reactstrap";
import { Play, Pause, VolumeX, Volume2 } from "react-feather";
import OutlineDocumentModal from "../../components/OutlineDocumentModal";

// Time Str 02:30 -> 150 seconds
function convertStrToSeconds(str) {
  const [mins, secs] = str.split(":");
  return parseInt(mins) * 60 + parseInt(secs);
}

// Give me a story and a time in seconds and i give
// you the current document now "playing"
function usePlayingDocument(story, playedSeconds) {
  // Memo the list of objects with from and to normalize as seconds
  const seekObjectsSeconds = useMemo(() => {
    const seekObjects = story.contents.modules[0].objects;
    return seekObjects.map((o) => ({
      ...o,
      from: convertStrToSeconds(o.from),
      to: convertStrToSeconds(o.to),
    }));
  }, [story]);

  // Memo only the id by searching from seeks array
  const playingDocuementId = useMemo(() => {
    if (playedSeconds === null) {
      return null;
    }
    const objInTime = find(
      seekObjectsSeconds,
      (o) => playedSeconds >= o.from && playedSeconds <= o.to
    );
    if (objInTime) {
      return objInTime.id;
    }
    return null;
  }, [seekObjectsSeconds, playedSeconds]);

  // Memo the doc: re find them only when id changes
  const playingDocuement = useMemo(() => {
    if (playingDocuementId === null) {
      return null;
    }
    return find(story.documents, { document_id: playingDocuementId });
  }, [playingDocuementId, story]);

  // Finally my doc
  return playingDocuement;
}

const SeekLine = React.memo(({ index, progress, onSeek, title, subtitle }) => {
  const width = progress === null ? 0 : progress * 100 + "%";
  const seekLineRef = useRef();

  function handleClick(e) {
    const clientX = e.clientX;
    const { left, width } = seekLineRef.current.getBoundingClientRect();
    const nextProgress = Math.min(
      Math.max(clientX - parseInt(left), 0) / width,
      1
    );
    onSeek(index, nextProgress);
  }

  return (
    <div
      className={classNames(
        styles.SeekContent,
        index > 2 ? styles.SeekContentBig : styles.SeekContentSmall
      )}
    >
      <div className={styles.SeekLineContainer}>
        <div>{title}</div>
        <div
          ref={seekLineRef}
          onClick={handleClick}
          className={styles.SeekLine}
        >
          <div className={styles.SeekProgress} style={{ width }} />
        </div>
        <div>{subtitle}</div>
      </div>
    </div>
  );
});

const PlayingDocuement = React.memo(({ document }) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = useCallback(() => setShowModal((a) => !a), []);
  return (
    <>
      <div className={styles.PlayingDocument} onClick={toggleModal}>
        <img src={document.data.translated_urls} alt={document.title} />
      </div>
      {showModal && (
        <OutlineDocumentModal doc={document} onClose={toggleModal} />
      )}
    </>
  );
});

export default function Outline() {
  const [outlineStory] = useCacheStory("outline");
  const [outlineTheme] = useCacheStory("outline-1", {
    withChapters: true,
  });
  const chapters = outlineTheme.data.chapters;

  const [chapterIndex, setChapterIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const togglePlay = () => setPlaying((a) => !a);
  const [volume, setVolume] = useState(1);
  const toggleMute = () => setVolume((v) => (v === 0 ? 1 : 0));
  const [progress, setProgress] = useState({
    played: 0,
    playedSeconds: 0,
  });
  const playerRef = useRef();

  const chapter = chapters[chapterIndex];

  const playingVideoUrl = useMemo(() => {
    const documentId = chapter.contents.modules[0].object.id;
    const docVideo = find(chapter.documents, { document_id: documentId });
    return docVideo.data.translated_urls;
  }, [chapter]);

  const playingDocument = usePlayingDocument(chapter, progress.playedSeconds);
  console.log(playingDocument, chapter, progress);

  const handleSeek = useCallback((index, progressFraction) => {
    setChapterIndex(index);
    setProgress({
      played: progressFraction,
      playedSeconds: null, // Will auto set by my player
    });
    playerRef.current.seekTo(progressFraction, "fraction");
  }, []);

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
              setChapterIndex(chapterIndex + 1);
              playerRef.current.seekTo(0, "fraction");
              setProgress({
                played: 0,
                playedSeconds: null,
              });
            }
          }}
          volume={volume}
          width="100%"
          height="100%"
          playing={playing}
          url={playingVideoUrl}
          playsinline
        />
        {playingDocument && <PlayingDocuement document={playingDocument} />}
        <div className={`${styles.Controls} pb-3 px-5 position-relative`}>
          <div className="p-4 d-flex">
            <Button onClick={togglePlay}>
              {playing ? <Pause /> : <Play />}
            </Button>
            <Button className="ml-2" onClick={toggleMute}>
              {volume === 0 ? <VolumeX /> : <Volume2 />}
            </Button>
          </div>
          <div className="d-flex">
            {chapters.map((chapter, i) => (
              <SeekLine
                key={i}
                onSeek={handleSeek}
                index={i}
                title={chapter.data.title}
                subtitle={
                  chapter.data.subtitle ? chapter.data.subtitle : "1970-1977"
                }
                progress={i === chapterIndex ? progress.played : null}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
