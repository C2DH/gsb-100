import React from 'react'
import ZoomAndPanMedia from '../../ZoomAndPanMedia'
import DocumentInfoBox from '../DocumentInfoBox'
import styles from './DocumentInfoImage.module.scss'

export default function DocumentInfoImage({ doc }) {
  return (
    <React.Fragment>
      <div className={styles.InfoImageContainer}>
        <ZoomAndPanMedia src={doc.attachment} />
      </div>
      <DocumentInfoBox doc={doc} />
    </React.Fragment>
  )
}
