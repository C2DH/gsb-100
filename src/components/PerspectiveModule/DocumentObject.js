import React from 'react'
import AudioTrack from '../AudioTrack'
import Video from '../Video'
import { Caption, DocLink } from './ModuleUtils'
import styles from './PerspectiveModule.module.scss'

export default function DocumentObject({ document, caption, className }) {
  if (document.type === 'image' || document.type === 'pdf') {
    const imagePreviewUrl = document.data.resolutions?.preview?.url
    return (
      <div className={className}>
        <DocLink document={document}>
          <img
            alt={document.data.title}
            src={imagePreviewUrl}
            style={{
              width: 'auto',
              height: 'auto',
              maxHeight: '70vh',
              maxWidth: '100%',
            }}
          />
          <Caption caption={caption}></Caption>
        </DocLink>
      </div>
    )
  } else if (document.type === 'video') {
    const videoUrl = document.url ? document.url : document.data.translated_urls

    return (
      <div className={className}>
        {videoUrl && <Video url={videoUrl} />}
        <DocLink document={document}>
          <Caption caption={caption}></Caption>
        </DocLink>
      </div>
    )
  } else if (document.type === 'audio') {
    const audioUrl = document.url
    return (
      <div className={className}>
        {audioUrl && <AudioTrack url={audioUrl} module />}
        <DocLink document={document}>
          <Caption caption={caption}></Caption>
        </DocLink>
      </div>
    )
  }
  return null
}
