import React from 'react'
import AudioTrack from '../../AudioTrack'
import DocumentInfoBox from '../DocumentInfoBox'

export default function DocumentInfoAudio({ doc }) {
  const audioUrl = doc.url ? doc.url : doc.attachment
  return (
    <div className="h-100 d-flex flex-column">
      <div className="container py-5 h-50">
        <div className="row h-100 align-items-center">
          <div className="col-12 col-lg-10 offset-lg-1">
            {audioUrl && <AudioTrack url={audioUrl} />}
          </div>
        </div>
      </div>
      <DocumentInfoBox doc={doc} />
    </div>
  )
}
