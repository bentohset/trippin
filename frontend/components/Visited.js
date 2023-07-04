import React from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import getCountryISO2 from 'country-iso-3-to-2'
import { getName } from 'country-list'
import { useRouter } from 'next/router'

function Visited({ stats }) {
    const geoUrl = "/features.json";
    const numberVisited = stats.length
    const percentageVisited = numberVisited / 202 * 100
    const router = useRouter();

    const VisitedStatBoard = () => (
        <div className='bg-white rounded-2xl z-20 absolute right-0 top-0 h-full w-1/3 shadow-md p-4'>
            <div className='text-black flex flex-col gap-2'>
                <h1 className='font-bold text-2xl'>Statistics</h1>
                <div>
                    <p><span className='font-bold'>{numberVisited}</span> countries visited</p>
                </div>
                <div>
                    <p><span className='font-bold'>{percentageVisited.toFixed(2)}%</span> of the world visited</p>
                </div>
                <div className='mt-2'>
                    <p className='font-bold text-lg'>Top 5 visited countries</p>
                    {stats.length > 0 ? (stats.slice(0,5).map((place, index) => {
                        const name = getName(place.countryCode)
    
                        return (
                            <p key={index}><span className='font-semibold'>{index+1}.</span> {name} <span className='font-bold text-black'>{place.frequency}</span></p>
                        )
                    })):(
                        <div className='flex flex-col justify-center items-center'>
                            <p className='text-sm text-gray-600 mt-2'>You have no trips yet, add some now!</p>
                            <button 
                                className='mt-4 text-white bg-[#FD5B61] px-8 py-2 shadow-md rounded-full
                                    font-bold hover:shadow-xl active:scale-90 transition duration-150 text-sm'
                                onClick={()=>{router.push('/addtrip')}}
                            >Add trip</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    const VisitedMap = () => (
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
                    const isVisited = stats.some((trip) => trip.countryCode.toUpperCase() === countryCode)

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

  return (
    <section>
        <h2 className='text-4xl font-semibold py-8'>
            Visited
        </h2>
        <div className='flex flex-row justify-center text-white items-center w-full h-[500px] mb-10 relative rounded-2xl bg-[#AAD7FF] shadow-md'>
            <VisitedMap/>
            <VisitedStatBoard/>
        </div>
    </section>
  )
}

export default Visited