import React from 'react'
import { Video, AudioTrack } from './UniqueMedia'
import YtVideo from '../YtVideo'
import { Caption } from './ModuleUtils'
import DocLink from '../DocLink'

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
              width: '100%',
              height: 'auto',
            }}
            className="customCursor"
          />
          <Caption caption={caption}></Caption>
        </DocLink>
      </div>
    )
  } else if (document.type === 'video') {
    const videoUrl = document.url ? document.url : document.data.translated_urls
    const yt = videoUrl.match(
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w|-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/
    )

    return (
      <div className={className}>
        {videoUrl && yt ? (
          <YtVideo url={videoUrl}></YtVideo>
        ) : (
          videoUrl && <Video url={videoUrl} tracks={document.data.subtitles} />
        )}
        <DocLink document={document}>
          <Caption caption={caption}></Caption>
        </DocLink>
      </div>
    )
  } else if (document.type === 'audio') {
    const audioUrl = document.url ? document.url : document.attachment
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
