import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { GoogleMap, MarkerF, useLoadScript, InfoWindowF } from "@react-google-maps/api";
import { FaBeer, FaMapMarkerAlt } from "react-icons/fa";
import { faBus, faLocationDot } from "@fortawesome/free-solid-svg-icons";



function Map({ clat, clng, places, isLoaded }) {
  const libraries = useMemo(() => ['places'], []);
  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();

  useEffect(() => {
    
    if (places.length !== 0) {
      const bounds = new window.google.maps.LatLngBounds();
      places?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
      bounds.extend({ lat: clat, lng: clng })
      mapRef.fitBounds(bounds);
      const zoom = mapRef.getZoom();
      const maxZoom = 14; // Set your desired maximum zoom level
      if (zoom > maxZoom) {
        mapRef.setZoom(maxZoom);
      }
    }
  }, [places, mapRef]);

  // useEffect(()=> {
  //     places?.forEach(({ lat, lng, address, day, name }) => bounds.extend({ lat, lng }));
  //     bounds.extend({ lat: clat, lng: clng })
  //     mapRef.fitBounds(bounds);
  //     const zoom = mapRef.getZoom();
  //     const maxZoom = 14; // Set your desired maximum zoom level
  //     if (zoom > maxZoom) {
  //       mapRef.setZoom(maxZoom);
  //     }
  //   }
  // },[places])
  

  const onMapLoad = (map) => {
    console.log('map loading............')
    setMapRef(map);
    const bounds = new google.maps.LatLngBounds();
    console.log("places", places)
    if (places.length !== 0) {
      places?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
      map.fitBounds(bounds);
    }
    
    
  };

  const handleMarkerClick = (id, lat, lng, address, name) => {
    setInfoWindowData({ id, name, address });
    setIsOpen(true);
  };

  
  const mapCenter = useMemo(() => ({ lat: clat, lng: clng }), [clat, clng]);

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
    }),
    []
  );


  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const renderColor = (day) => {
    switch (day) {
      case 0: return '#636363'
      case 1: return "#0000ff"
      case 2: return "#e6550d"
      case 3: return "#8856a7"
    }
  }

  return (
    <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={5}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {places && DUMMY.map(({ address, lat, lng, name, day }, ind) => (
          <MarkerF
            key={ind}
            position={{ lat, lng }}
            onClick={() => {
              handleMarkerClick(ind, lat, lng, address, name);
            }}
            icon={{
              path: faLocationDot.icon[4],
              fillColor: renderColor(day),
              fillOpacity: 1,
              anchor: new google.maps.Point(
                faLocationDot.icon[0] / 2, // width
                faLocationDot.icon[1] // height
              ),
              strokeWeight: 2,
              strokeColor: "#ffffff",
              scale: 0.075,

            }}
          >
            {isOpen && infoWindowData?.id === ind && (
              <InfoWindowF
                onCloseClick={() => {
                  setIsOpen(false);
                }}
              >
                <div className='flex-col flex justify-center items-center'>
                  <p className='font-medium'>{infoWindowData.name}</p>
                  <p>{infoWindowData.address}</p>
                </div>
              </InfoWindowF>
            )}
          </MarkerF>
        ))}
      </GoogleMap>
  )
    // <ReactMapGL
    //     reuseMaps
    //     mapStyle='mapbox://styles/mapbox/streets-v9'
    //     mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
	// 	{...viewState}
	// 	onMove={evt => setViewState(evt.viewState)}
	// 	// initialViewState={viewport}
    // >
	// 	<NavigationControl position="top-left" showCompass={false}/>
    //   {/* {DUMMY.map(result=>(
    //       <Marker
	// 	  	key={result.place}
    //         longitude={result.long}
    //         latitude={result.lat}
    //         anchor='top'
    //       >
    //       </Marker>
    //   ))} */}
    // </ReactMapGL>
}

const containerStyle = {
  width: '400px',
  height: '400px'
};

const DUMMY = [
  {
    address:"Palazzo della Civiltà Italiana, Quadrato della Concordia, Rome, Metropolitan City of Rome Capital, Italy",
    lng: 12.4652102,
    lat: 41.8368815,
    name: 'Palazzo della Civiltà Italiana',
    day: 1
  },
  {
    address:"Basilica di San Giovanni in Laterano, Piazza di S. Giovanni in Laterano, Rome, Metropolitan City of Rome Capital, Italy",
    lng: 12.505673,
    lat: 41.8858811,
    name: 'Basilica di San Giovanni in Laterano',
    day: 0
  },
]
export default Map