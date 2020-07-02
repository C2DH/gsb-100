import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function MapHomePure() {
  const [zoom, setZoom] = useState(5);
  const center = [5.9714557, 50.4346632];
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-v9", // stylesheet location
        center: center,
        zoom: zoom,
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
        setZoom(10);
      });
    };

    if (!map) {
      initializeMap({ setMap, mapContainer });
    } else {
      map.flyTo({
        zoom: zoom,
        speed: 0.2, // make the flying slow
        curve: 1, // change the speed at which it zooms out
      });
    }
  }, [center, zoom, map]);

  // useEffect(() => {
  //   if (map) {
  //
  //   }
  // }, [center, zoom, map]);

  return (
    <div
      ref={(el) => (mapContainer.current = el)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
