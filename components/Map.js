import React, {useState} from 'react'
import ReactMapGL, {Marker, Popup, ScaleControl} from 'react-map-gl'
import { getCenter } from 'geolib';

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

function Map() {
  const [selected, setSelected] = useState({});
  
  const coordinates = DUMMY.map((result)=>({
    longitude: result.long,
    latitude: result.lat,

  }));

  const center = getCenter(coordinates);
  const [viewport, setViewport] = useState({
    longitude: center.longitude,
    latitude: center.latitude,
    zoom: 8,
  })
  return (
    <ReactMapGL
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxAccessToken={process.env.mapbox_key}
        style={{height: '100%', width: '100%'}}
        initialViewState={viewport}
    >
      {DUMMY.map(result=>(
        <div key={result.place}>
          <Marker
            longitude={result.long}
            latitude={result.lat}
            anchor='top'
          >
            {/* <p onClick={()=>setSelected(result)} 
              role="img"
              
              className='cursor-pointer text-2xl animate-bounce z-10'
              aria-label="push-pin"
            >
            📌
            </p> */}
          </Marker>
          {selected.long === result.long ? (
            <Popup
              closeOnClick={true}
              onClose={()=>setSelected({})}
              latitude={result.lat}
              longitude={result.long}
            >
              {result.place}
            </Popup>
          ):(
            false
          )}
        </div>
      ))}
    </ReactMapGL>
  )
}

export default Map