import React from 'react'
import Menu from '../Menu'

// Used as placeholder while loading a page
export default function FullPageLoader({ menu = false }) {
  return (
    <div>
      {menu && <Menu />}
      <div>
        Loading your page...
      </div>
    </div>
  )
}