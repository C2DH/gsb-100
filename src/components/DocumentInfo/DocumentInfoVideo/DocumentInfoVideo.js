import React from 'react'
import styles from './DocumentInfoVideo.module.scss'
import DocumentInfoBox from '../DocumentInfoBox'
import Video from '../../Video'

export default function DocumentInfoVideo({ doc }) {
  return (
    <div className={styles.VideoContainer}>
      <div className={styles.PlayerContainer}>
        <div className={styles.PlayerWrapper}>
          {/* <video src={doc.url} controls disablePictureInPicture /> */}
          <Video url={doc.url} />
        </div>
      </div>
      <DocumentInfoBox doc={doc} />
    </div>
  )
}
