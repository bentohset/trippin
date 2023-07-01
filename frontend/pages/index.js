import Head from 'next/head'
import { useRouter } from 'next/router';
import Header from '../components/Header'
import Banner from '../components/Banner'
import SmallCard from '../components/SmallCard'

import ProtectedRoute from '../components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/auth';
import VisitedMap from '../components/VisitedMap';
import VisitedStatBoard from '../components/VisitedStatBoard';


const Home = () => {
	const { cookies } = useAuth()
	const [trips, setTrips]  = useState()
  const [stats, setStats] = useState([])

	const router = useRouter()

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
  
	useEffect(() => {
		const fetchData = async () => {
			try {
				let dev = process.env.NODE_ENV !== 'production';

				const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/user/trip/${cookies.id}`

				const response = await fetch(url, {
					method: 'GET',
					headers: {
					'Content-Type': 'application/json',
					}
				})

				const data = await response.json();
				setTrips(data)
        setStats(getStats(data))

			} catch (error) {
				console.log(error)
			}
		}

		fetchData()

		
	}, [])

  const getStats = (tripArr) => {
    const map = {}

    tripArr.forEach((trip) => {
      const countryCode = trip.countryCode || ""
      if (countryCode !== "") {
        map[countryCode] = (map[countryCode] || 0) + 1
      }
    })

    let result = Object.entries(map).map(([countryCode, frequency]) => ({
      countryCode,
      frequency,
    }));

    const sorted = result.sort((a,b) => b.frequency - a.frequency)

    return sorted
  }
  
  return (
    <div className=''>
      <Head>
        <title>Trip Planner App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> 
      {/* Header */}
      <Header/>
      <div className='m-2'></div>

      {/* Banner */}
      <Banner />
      
      <main className='max-w-7xl mx-auto px-8 sm:px-16'>
        
        <section className='pt-6'>
          <h2 className='text-4xl font-semibold pb-5'>Your Trips</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4'>
            {trips && trips.map(({_id, img, location, startDate, endDate, title, countryCode})=>(
              
                <SmallCard 
                  key={_id}
                  id={_id}
                  location={location} 
                  startDate={convertDate(startDate)} 
                  endDate={convertDate(endDate)}
                  year={getYear(startDate)}
                  title={title}
                  countryCode={countryCode}
                />

            ))}
          </div>
        </section>
        
        <section>
          <h2 className='text-4xl font-semibold py-8'>
            Visited
          </h2>
          <div className='flex flex-row justify-center text-white items-center w-full h-[500px] mb-10 relative rounded-2xl bg-[#AAD7FF] shadow-md'>
              <VisitedMap visitedPlaces={stats}/>
              <VisitedStatBoard visitedPlaces={stats}/>
          </div>
        </section>

        <section>
          <h2 className='text-4xl font-semibold py-8'>Devs to do list</h2>
          <ol className='font-semibold text-xl p-2 mb-10 space-y-4 list-disc'>
            <li>fix bug: map zoom based on country size</li>
            <li>fix cost bug</li>
            <li>implement profile settings</li>
            <li>fix delete refresh</li>
          </ol>
        </section>
      </main>
    </div>
  )
}

export default ProtectedRoute(Home);

const DUMMY_DATA =[
  {
    img:"https://github.com/twbs.png",
    location: "London",
    startDate:"3 Jan",
    endDate:"5 Jan",
  },
  {
    img:"https://github.com/twbs.png",
    location: "New York",
    startDate:"3 Jan",
    endDate:"5 Jan",
  },
  {
    img:"https://github.com/twbs.png",
    location: "Johor Bahru",
    startDate:"3 Jan",
    endDate:"5 Jan",
  },
  {
    img:"https://github.com/twbs.png",
    location: "Singapore",
    startDate:"3 Jan",
    endDate:"5 Jan",
  },
  {
    img:"https://github.com/twbs.png",
    location: "Australia",
    startDate:"3 Jan",
    endDate:"5 Jan",
  },
  {
    img:"https://github.com/twbs.png",
    location: "China",
    startDate:"3 Jan",
    endDate:"5 Jan",
  },
  {
    img:"https://github.com/twbs.png",
    location: "Scotland",
    startDate:"3 Jan",
    endDate:"5 Jan",
  },
  {
    img:"https://github.com/twbs.png",
    location: "Denmark",
    startDate:"3 Jan",
    endDate:"5 Jan",
  },
]