import React, { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const zoom = 4
const center = [6.2, 50.4346632]

export default function MapHome() {
  const mapContainer = useRef(null)

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/giorgiouboldi/ckcp21z5501qw1imwvmd6wyxo/draft', // stylesheet location
      center: center,
      zoom: zoom,
    })

    map.on('load', () => {
      map.flyTo({
        zoom: 15,
        speed: 0.3, // make the flying slow
        curve: 1, // change the speed at which it zooms out
      })
    })

    return () => {
      map.remove()
    }
  }, [])

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
}
