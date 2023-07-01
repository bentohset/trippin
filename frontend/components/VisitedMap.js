import React from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import getCountryISO2 from 'country-iso-3-to-2'


const DUMMY = [
    {
        location: "China",
        center: [101.901875103385, 35.4867029846329]
    },
    {
        location: "Rome",
        center: [12.4829321, 41.8933203]
    },
    {
        location: "Singapore",
        center: [103.808052586332, 1.3516161224392]
    },
    {
        location: "Indiana",
        center: [-79.152535, 40.621455]
    },
]



const geoUrl = "/features.json";

function VisitedMap({ visitedPlaces }) {

  return (
        <ComposableMap 
            projection='geoMercator'
            projectionConfig={{
                rotate: [0, 0, 0],
                scale: 150
            }}
            width={800}
            height={500}
            style={{
                position: 'absolute',
                height: "600px",
                top: 0,
                left: 0,
                width: "70%", 
                height: "100%"
            }}
        >
            <ZoomableGroup
                center={[0, 40]} zoom={1}
            >
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                geographies.map((geo) => {
                    const countryCode = getCountryISO2(geo.id)
                    const isVisited = visitedPlaces.some((trip) => trip.countryCode.toUpperCase() === countryCode)

                    return (
                        <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={isVisited ? '#FD5B61' : '#FFF'}
                            stroke="#D6D6DA"
                        />
                    );
                })
                }
            </Geographies>
            </ZoomableGroup>
        </ComposableMap>
  )
}

export default VisitedMap