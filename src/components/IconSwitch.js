import React from 'react'
import { Image, FileText, Youtube, Headphones, HelpCircle } from 'react-feather'

function IconSwitch({ type }) {
  switch (type) {
    case 'image':
      return <Image />
    case 'pdf':
      return <FileText />
    case 'video':
      return <Youtube />
    case 'audio':
      return <Headphones />
    default:
      return <HelpCircle />
  }
}

export default IconSwitch
