import React from 'react'
import ReactMapGL from 'react-map-gl'

function Map() {
  return (
    <ReactMapGL
        mapStyle='mapbox://styles/mapbox/streets-v12'
        mapboxAccessToken={process.env.mapbox_key}
        initialViewState={{
            longitude: -100,
            latitude: 40,
            zoom: 3.5
        }}
        height="100%"
    >

    </ReactMapGL>
  )
}

export default Map