import React from 'react'
import ZoomAndPanMedia from '../../ZoomAndPanMedia'
import DocumentInfoBox from '../DocumentInfoBox'
import styles from './DocumentInfoImage.module.scss'
import { usePreloadImage } from '../../../hooks'

export default function DocumentInfoImage({ doc }) {
  const lowResolutionImage = doc.data.resolutions?.preview?.url
  const highResolutionImage = doc.attachment

  // Preload the high resolution image only if we have
  // a fallback low resolution image
  const isLoaded = usePreloadImage(
    lowResolutionImage ? highResolutionImage : null
  )

  // Use the low resolution when not loaded or when we have no high
  // resolution image
  let imageUrl
  if (!isLoaded && lowResolutionImage) {
    imageUrl = lowResolutionImage
  } else {
    imageUrl = highResolutionImage
  }

  return (
    <React.Fragment>
      <div className={styles.InfoImageContainer}>
        <ZoomAndPanMedia src={imageUrl} />
      </div>
      <DocumentInfoBox doc={doc} />
    </React.Fragment>
  )
}
