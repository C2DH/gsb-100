import { memo, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const Portal = ({ selector, children }) => {
  const el = useRef(
    document.querySelector(selector) || document.createElement('div')
  )
  const [dynamic] = useState(!el.current.parentElement)
  useEffect(() => {
    const current = el.current
    if (dynamic) {
      current.id = selector
      document.body.appendChild(el.current)
    }
    return () => {
      if (dynamic && current.parentElement) {
        current.parentElement.removeChild(current)
      }
    }
  }, [selector, dynamic])
  return createPortal(children, el.current)
}

export default memo(Portal)
