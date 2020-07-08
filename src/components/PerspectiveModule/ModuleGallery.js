import React from 'react'
import Gallery from './Gallery'

export default function ModuleGallery({ module }) {
  return (
    <Gallery objects={module.objects} />
  )
}
