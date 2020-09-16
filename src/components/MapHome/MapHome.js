import React, { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const zoom = 4
const center = [6.2, 50.4346632]

export default function MapHome({ setShowVideo, setPlaying, setShowPlay }) {
  const mapContainer = useRef(null)

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/giorgiouboldi/ckcp2ku8202851ip2tdid4lxv', // stylesheet location
      center: center,
      zoom: zoom,
      attributionControl: false,
    })

    map.on('load', () => {
      map.flyTo({
        zoom: 12,
        speed: 0.3, // make the flying slow
        curve: 1, // change the speed at which it zooms out
      })
    })

    map.on('zoom', () => {
      const actualZoom = map.getZoom()
      if (actualZoom > 11) {
        setShowVideo(true)
        setPlaying(true)
        setShowPlay(true)
      }
    })

    return () => {
      map.remove()
    }
  }, [setShowVideo, setPlaying, setShowPlay])

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
}
