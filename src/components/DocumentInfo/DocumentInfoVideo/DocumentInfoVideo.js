import React from 'react'
import styles from './DocumentInfoVideo.module.scss'
import DocumentInfoBox from '../DocumentInfoBox'
import Video from '../../Video'

export default function DocumentInfoVideo({ doc }) {
  return (
    <React.Fragment>
      <div className={styles.VideoContainer}>
        <div className={styles.PlayerWrapper}>
          <Video url={doc.url} width="auto" height="auto" />
        </div>
      </div>
      <DocumentInfoBox doc={doc} />
    </React.Fragment>
  )
}
