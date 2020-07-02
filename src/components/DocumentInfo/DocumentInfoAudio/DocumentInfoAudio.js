import React from 'react'
import styles from './DocumentInfoAudio.module.scss'
import AudioTrack from '../../AudioTrack'
import DocumentInfoBox from '../DocumentInfoBox'

export default function DocumentInfoAudio({ doc }) {
  return (
    <div className={styles.DocumentInfoAudio}>
      <div className={styles.AudioContainer}>
        <AudioTrack url={doc.url} />
      </div>
      <DocumentInfoBox doc={doc} />
    </div>
  )
}
