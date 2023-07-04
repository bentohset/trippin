import React from 'react'
import SmallCard from './SmallCard'
import { useAuth } from "../hooks/auth";

function Trips({ trips, setTrips, decreaseStat }) {
  const { cookies } = useAuth()
  const convertDate = (date) => {
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const day = date.slice(8,10) //8 and 9
		const monthIndex = parseInt(date.slice(5,7)); //5 and 6
		const year = date.slice(0,4)//0-3 index
		const month = monthNames[monthIndex-1];
		return `${day} ${month}`
	}

	const getYear = (date) => {
		const year = date.slice(0,4)//0-3 index
		return year
	}
    

    const handleDeleteTrip = async (id, countryCode) => {
        let dev = process.env.NODE_ENV !== 'production';
    
        const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/user//${id}/${cookies.id}`
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          } 
        })
    
        await response.json()
        .then(data => {
          if (response.status === 200) {
            setTrips(prevTrips => prevTrips.filter(tripObj => tripObj._id !== id))
            decreaseStat(countryCode)
          } else {
            console.log(data.message)
          }
        })
    }
    
  return (
    <section className='pt-6'>
        <h2 className='text-4xl font-semibold pb-5'>Your Trips</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4'>
        {trips && trips.length > 0 ? trips.map(({_id, img, location, startDate, endDate, title, countryCode})=>(
            
            <SmallCard
                key={_id}
                id={_id}
                location={location} 
                startDate={convertDate(startDate)} 
                endDate={convertDate(endDate)}
                year={getYear(startDate)}
                title={title}
                countryCode={countryCode}
                handleDeleteTrip={handleDeleteTrip}
            />

        ))
        :(
            <p className='text-gray-500 text-lg'>You have no trips yet :(</p>
        )}

        </div>
    </section>
  )
}

export default Trips