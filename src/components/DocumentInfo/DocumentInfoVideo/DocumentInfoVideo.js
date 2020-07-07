import React from 'react'
import styles from './DocumentInfoVideo.module.scss'
import DocumentInfoBox from '../DocumentInfoBox'
import Video from '../../Video'

export default function DocumentInfoVideo({ doc }) {
  return (
    <React.Fragment>
      <div className={styles.VideoContainer}>
        <div className={styles.PlayerContainer}>
          <div className={styles.PlayerWrapper}>
            {/* <video src={doc.url} controls disablePictureInPicture /> */}
            <Video url={doc.url} width="auto" height="auto" />
          </div>
        </div>
      </div>
      <DocumentInfoBox doc={doc} />
    </React.Fragment>
  )
}
