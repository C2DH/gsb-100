import React, { createContext, useEffect, useRef, useState, useContext } from 'react'
import VanillaVideo from '../Video'

let mediaIdGlobal = 0
export const UnqiueMediaContext = createContext([null, () => {}])

export function UnqueMedia({ children }) {
  const playingState = useState(null)
  return (
    <UnqiueMediaContext.Provider value={playingState}>
      {children}
    </UnqiueMediaContext.Provider>
  )
}

export function Video(props) {
  const playerRef = useRef(null)
  const [playingId, setPlayingId] = useContext(UnqiueMediaContext)

  const mediaIdRef = useRef(null)
  if (!mediaIdRef.current) {
    mediaIdRef.current = ++mediaIdGlobal
  }
  const mediaId = mediaIdRef.current

  useEffect(() => {
    if (playingId !== null && playingId !== mediaId) {
      playerRef.current.setPlaying(false)
    }
  }, [playingId, mediaId])

  return (
    <VanillaVideo
      ref={playerRef}
      onPlay={() => setPlayingId(mediaId)}
      onPause={() => setPlayingId(null)}
      {...props}
    />
  )
}
