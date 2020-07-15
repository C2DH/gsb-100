import React from 'react'
import AudioTrack from '../../AudioTrack'
import DocumentInfoBox from '../DocumentInfoBox'

export default function DocumentInfoAudio({ doc }) {
  const audioUrl = doc.url ? doc.url : doc.attachment
  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-grow-1 d-flex align-items-center p-5">
        {audioUrl && <AudioTrack url={audioUrl} />}
      </div>
      <DocumentInfoBox doc={doc} />
    </div>
  )
}
