import React, {
  createContext,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useReducer,
} from 'react'
import VanillaVideo from '../Video'
import VanillaAudio from '../AudioTrack'

let mediaIdGlobal = 0
const UnqiueMediaStateContext = createContext(null)
const UnqiueMediaDispatcherContext = createContext(null)

function uniqueMediaReducer(state, action) {
  if (action.type === 'play') {
    return action.payload
  }
  if (action.type === 'pause') {
    if (state === action.payload) {
      return null
    }
    return state
  }
  throw new Error('Invalid unqieu media action')
}

export function UnqueMedia({ children }) {
  const [state, dispatch] = useReducer(uniqueMediaReducer, null)
  return (
    <UnqiueMediaDispatcherContext.Provider value={dispatch}>
      <UnqiueMediaStateContext.Provider value={state}>
        {children}
      </UnqiueMediaStateContext.Provider>
    </UnqiueMediaDispatcherContext.Provider>
  )
}

export function useUniqueMediaStop() {
  const dispatch = useContext(UnqiueMediaDispatcherContext)

  const stopMedias = useCallback(() => {
    dispatch({
      type: 'play',
      payload: '__STOP__',
    })
  }, [dispatch])

  const clearStopMedias = useCallback(() => {
    dispatch({
      type: 'pause',
      payload: '__STOP__',
    })
  }, [dispatch])

  return { stopMedias, clearStopMedias }
}

function useUniqueMedia(onMediaNeedToStop) {
  const playingId = useContext(UnqiueMediaStateContext)
  const dispatch = useContext(UnqiueMediaDispatcherContext)

  const mediaIdRef = useRef(null)
  const getMediaId = useCallback(() => {
    if (!mediaIdRef.current) {
      mediaIdRef.current = ++mediaIdGlobal
    }
    return mediaIdRef.current
  }, [])

  const onPlay = useCallback(() => {
    dispatch({ type: 'play', payload: getMediaId() })
  }, [dispatch, getMediaId])

  const onPause = useCallback(() => {
    dispatch({ type: 'pause', payload: getMediaId() })
  }, [dispatch, getMediaId])

  const lastCallbackRef = useRef(onMediaNeedToStop)
  useEffect(() => {
    lastCallbackRef.current = onMediaNeedToStop
  })

  useEffect(() => {
    const callback = lastCallbackRef.current
    const mediaId = getMediaId()
    if (playingId !== null && playingId !== mediaId) {
      callback()
    }
  }, [playingId, getMediaId])

  // Clear current playing on unmount
  useEffect(() => {
    const mediaId = getMediaId()
    return () => onPause(mediaId)
  }, [onPause, getMediaId])

  return {
    onPlay,
    onPause,
  }
}

export function Video(props) {
  const playerRef = useRef(null)

  const { onPlay, onPause } = useUniqueMedia(() => {
    playerRef.current.setPlaying(false)
  })

  return (
    <VanillaVideo
      ref={playerRef}
      onPlay={onPlay}
      onPause={onPause}
      {...props}
    />
  )
}

export function AudioTrack(props) {
  const playerRef = useRef(null)

  const { onPlay, onPause } = useUniqueMedia(() => {
    playerRef.current.setPlaying(false)
  })

  return (
    <VanillaAudio
      ref={playerRef}
      onPlay={onPlay}
      onPause={onPause}
      {...props}
    />
  )
}