import React from 'react'
import { useAuth } from "../hooks/auth";
import ProfileTripCard from './ProfileTripCard'
import { useRouter } from "next/router";

function ProfileTrips({ trips, setTrips, setUser }) {
    const { cookies } = useAuth()
    const router = useRouter()

    const handleDeleteTrip = async (id) => {
		let dev = process.env.NODE_ENV !== 'production';

		const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/user/${id}/${cookies.id}`
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			} 
		})

		const data = await response.json()
		.then(data => {
			if (response.status === 200) {
				setTrips(prevTrips => prevTrips.filter(tripObj => tripObj._id !== id))
				setUser(prevUser => {
					const updatedTrips = prevUser.trips.filter(tripId => tripId !== id);
					return { ...prevUser, trips: updatedTrips}
				})
			} else {
				console.log(data.message)
			}
		})
    }

  return (
    <div className='flex w-full flex-col items-center '>
        <h1 className="font-bold text-xl mb-4">Your Trips</h1>
            <section className="flex flex-col w-full h-fit border-2 rounded-xl">
				{trips.length > 0 ? 
					(
					<div className="flex flex-col items-start">
						{trips.map((trip, index)=>(
						<ProfileTripCard
							key={trip._id}
							index={index}
							length={trips.length}
							id={trip._id}
							location={trip.location} 
							startDate={trip.startDate} 
							endDate={trip.endDate}
							year={trip.startDate}
							title={trip.title}
							handleDeleteTrip={handleDeleteTrip}
						/>
						))}
					</div>
				):(
					<div className="p-4 flex justify-center items-center flex-col">
						<p className="text-gray-600">You have no trips. Add a trip now!</p>
						<button 
                            className='mt-4 text-white bg-[#FD5B61] px-8 py-2 shadow-md rounded-full
                                font-bold hover:shadow-xl active:scale-90 transition duration-150 text-sm'
                            onClick={()=>{router.push('/addtrip')}}
                        >Add trip</button>
					</div>
				)}
            </section>
    </div>
  )
}

export default ProfileTrips