import React from 'react'
import { Image, FileText, Youtube, Headphones, HelpCircle } from 'react-feather'

function IconSwitch({ type, color }) {
  switch (type) {
    case 'image':
      return <Image color={color} />
    case 'pdf':
      return <FileText color={color} />
    case 'video':
      return <Youtube color={color} />
    case 'audio':
      return <Headphones color={color} />
    default:
      return <HelpCircle color={color} />
  }
}

export default IconSwitch
