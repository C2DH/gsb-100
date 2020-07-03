import React from 'react'

export default function ModuleTextObject({ module }) {
  const doc = module.object.document
  const image = doc.data.resolutions?.preview?.url
  console.log('MMM', module, image)

  return (
    <div>
      MY MODULE TEXT OBJ!
      {/* <img alt={doc.data.title} src={} /> */}
    </div>
  )
}
