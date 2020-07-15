import React from 'react'
import styles from './DocumentInfoVideo.module.scss'
import DocumentInfoBox from '../DocumentInfoBox'
import Video from '../../Video'

export default function DocumentInfoVideo({ doc }) {
  const videoUrl = doc.data.translated_urls ? doc.data.translated_urls : doc.url

  return (
    <React.Fragment>
      <div className={styles.VideoContainer}>
        <div className={styles.PlayerWrapper}>
          {videoUrl && <Video url={videoUrl} width="auto" height="auto" />}
        </div>
      </div>
      <DocumentInfoBox doc={doc} />
    </React.Fragment>
  )
}
