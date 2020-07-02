import React, { useState } from "react";
import ReactMapboxGl from "react-mapbox-gl";

// TODO: maybe refactor without using ReactMapboxGl but just a basic component https://sparkgeo.com/blog/build-a-react-mapboxgl-component-with-hooks/
const ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const Map = ReactMapboxGl({
  accessToken: ACCESS_TOKEN,
  maxZoom: 11,
  minZoom: 5,
  interactive: false,
  attributionControl: false,
});

export default function MapHome() {
  const [zoom, setZoom] = useState([5]);
  const center = [5.9714557, 50.4346632];
  const onStyleLoad = (map) => {
    //TODO: maybe manage opacity from here
    //console.log(map.getStyle());
    setZoom([11]);
  };

  return (
    <Map
      style="mapbox://styles/mapbox/satellite-v9"
      containerStyle={{
        height: "100%",
        width: "100%",
      }}
      center={center}
      zoom={zoom}
      onStyleLoad={onStyleLoad}
      flyToOptions={{ speed: 0.2, curve: 1 }}
    ></Map>
  );
}
