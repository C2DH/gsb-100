import React from 'react'
import Gallery from './Gallery'
import Markdown from 'markdown-to-jsx'

export default function ModuleTextGallery({ module }) {
  if (module.layout === 'gallery-text') {
    return (
      <div>
        <Gallery
          objects={module.gallery.objects}
          caption={module.gallery.caption}
        />
        <Markdown>{module.text.content}</Markdown>
      </div>
    )
  } else {
    return (
      <div>
        <Markdown>{module.text.content}</Markdown>
        <Gallery
          objects={module.gallery.objects}
          caption={module.gallery.caption}
        />
      </div>
    )
  }
}