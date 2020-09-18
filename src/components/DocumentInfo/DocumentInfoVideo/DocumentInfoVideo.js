import React, { useMemo } from 'react'
import styles from './DocumentInfoVideo.module.scss'
import DocumentInfoBox from '../DocumentInfoBox'
import Video from '../../Video'
import YtVideo from '../../YtVideo'

export default function DocumentInfoVideo({ doc }) {
  const videoUrl =
    doc.data.translated_urls && doc.data.translated_urls instanceof String
      ? doc.data.translated_urls
      : doc.url

  const yt = useMemo(() => {
    return videoUrl.match(
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/
    )
      ? true
      : false
  }, [videoUrl])

  return (
    <React.Fragment>
      <div className={styles.VideoContainer}>
        <div className={styles.PlayerWrapper}>
          {videoUrl && yt ? (
            <YtVideo url={videoUrl} detail></YtVideo>
          ) : (
            videoUrl && (
              <Video
                url={videoUrl}
                width="auto"
                height="auto"
                tracks={doc.data.subtitles}
              />
            )
          )}
        </div>
      </div>
      <DocumentInfoBox doc={doc} />
    </React.Fragment>
  )
}
