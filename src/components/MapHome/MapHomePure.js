import React, { useState, useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const zoom = 5
const center = [5.9714557, 50.4346632]

export default function MapHomePure() {
  const mapContainer = useRef(null)

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9', // stylesheet location
      center: center,
      zoom: zoom,
    })

    map.on('load', () => {
      map.flyTo({
        zoom: 10,
        speed: 0.2, // make the flying slow
        curve: 1, // change the speed at which it zooms out
      })
    })

    return () => {
      map.remove()
    }
  }, [])

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
}
