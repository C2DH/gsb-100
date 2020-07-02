import React from 'react'
import ZoomAndPanMedia from '../../ZoomAndPanMedia'
import DocumentInfoBox from '../DocumentInfoBox'
import styles from './DocumentInfoImage.module.scss'

export default function DocumentInfoImage({ doc }) {
  return (
    <div className={styles.InfoImageContainer}>
      <ZoomAndPanMedia src={doc.attachment} />
      <DocumentInfoBox doc={doc} />
    </div>
  )
}
