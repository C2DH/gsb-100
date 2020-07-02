import React from 'react'
import styles from './DocumentInfoVideo.module.scss'
import DocumentInfoBox from '../DocumentInfoBox'

export default function DocumentInfoVideo({ doc }) {
  return (
    <div className={styles.VideoContainer}>
      <div className={styles.PlayerContainer}>
        <div className={styles.PlayerWrapper}>
          <video src={doc.url} controls disablePictureInPicture />
        </div>
      </div>
      <DocumentInfoBox doc={doc} />
    </div>
  )
}
