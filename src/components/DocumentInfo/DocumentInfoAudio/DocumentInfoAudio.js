import React from 'react'
import AudioTrack from '../../AudioTrack'
import DocumentInfoBox from '../DocumentInfoBox'

export default function DocumentInfoAudio({ doc }) {
  return (
    <div className="h-100 d-flex flex-column">
      <div className="flex-grow-1 d-flex align-items-center p-5">
        <AudioTrack url={doc.url} />
      </div>
      <DocumentInfoBox doc={doc} />
    </div>
  )
}
