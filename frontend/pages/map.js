import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import Map from '../components/Map'
import PlacesAutocomplete from '../components/PlacesAutocomplete'
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from 'use-places-autocomplete';

const index = 0

function map() {
  const libraries = useMemo(() => ['places'], []);
  const [clat, setCLat] = useState(27.672932021393862);
  const [clng, setCLng] = useState(85.31184012689732);

  const markers = [
    { address: "Address1", lat: 18.5204, lng: 73.8567 },
    { address: "Address2", lat: 18.5314, lng: 73.8446 },
    { address: "Address3", lat: 18.5642, lng: 73.7769 },
  ];

  const [places, setPlaces] = useState([])

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAPS_KEY,
    libraries: libraries,
  }); 

  return (
    <div className='h-screen bg-white flex justify-center items-center flex-row'>
        <div className='w-1/2 justify-center items-cente'>
            <p>test</p>
            {isLoaded ? <PlacesAutocomplete
                onAddressSelect={(address) => {
                    getGeocode({ address: address }).then((results) => {
                      const { lat, lng } = getLatLng(results[0]);
                      console.log(lat, lng)
                      const newObj = {
                        lat: lat,
                        lng: lng,
                        address: address,
                        day: index
                      }
                      console.log(newObj)
                      setPlaces(prev => 
                        [...prev, newObj]
                      )
                    });
               
                }}
            /> : null}
        </div>
        <div className='fixed right-0 w-1/2 h-screen '>
            <Map clat={clat} clng={clng} places={places} isLoaded={isLoaded}/>
        </div>
        
        
    </div>
  )
}

export default map