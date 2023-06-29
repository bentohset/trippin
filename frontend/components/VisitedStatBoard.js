import React from 'react'
import { getName } from 'country-list'
import { useRouter } from 'next/router'

function VisitedStatBoard({ visitedPlaces }) {
    const numberVisited = visitedPlaces.length
    const percentageVisited = numberVisited / 202 * 100
    const router = useRouter();


  return (
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
                {visitedPlaces.length > 0 ? (visitedPlaces.slice(0,5).map((place, index) => {
                    const name = getName(place.countryCode)

                    return (
                        <p><span className='font-semibold'>{index+1}.</span> {name} <span className='font-bold text-black'>{place.frequency}</span></p>
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
}

export default VisitedStatBoard
