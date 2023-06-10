import React, {useState} from 'react'
import ReactMapGL, {Marker, Popup, ScaleControl} from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'


const DUMMY = [
  {
    place:"India",
    long: -0.00222,
    lat: 51.5421,
  },
  {
    place:"Loool",
    long: -0.00222,
    lat: 51.8421,
  },
  {
    place:"tadsa",
    long: -0.10222,
    lat: 51.8421,
  },
  {
    place:"asdf",
    long: -0.30222,
    lat: 51.5421,
  },
]

const CENTER = [-79.152535, 40.621455]

function Map({ center }) {
  const [selected, setSelected] = useState({});
  const coordinates = DUMMY.map((result)=>({
    longitude: result.long,
    latitude: result.lat,

  }));

  const [viewport, setViewport] = useState({
    longitude: center[0],
    latitude: center[1],
    zoom: 5,
  })
  return (
    <ReactMapGL
        reuseMaps
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
        style={{height: '100%', width: '100%'}}
        initialViewState={viewport}
    >
      {DUMMY.map(result=>(
          <Marker
		  	key={result.place}
            longitude={result.long}
            latitude={result.lat}
            anchor='top'
          >
          </Marker>
      ))}
    </ReactMapGL>
  )
}

export default Map