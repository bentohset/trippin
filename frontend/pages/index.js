import Head from 'next/head'
import { useRouter } from 'next/router';
import Header from '../components/Header'
import Banner from '../components/Banner'
import SmallCard from '../components/SmallCard'

import ProtectedRoute from '../components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/auth';
import Footer from '../components/Footer';
import Visited from '../components/Visited';
import Trips from '../components/Trips';


const Home = () => {
	const { cookies } = useAuth()
	const [trips, setTrips]  = useState()
  const [stats, setStats] = useState([])

	const router = useRouter()
  
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

  //returns an array of objects: {countryCode:string(lowercase), freq: integer}
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

  const decreaseStat = (countryCode) => {
    setStats(prev => 
      prev.map(country => {
        if (country.countryCode === countryCode) {
          const updatedFreq = country.frequency - 1
          if (updatedFreq <= 0) {
            return null;
          } else {
            return { ...country, freq: updatedFreq}
          }
        }

        return country
      }).filter(Boolean)
    )
    console.log(stats)
  }

  

  
  
  return (
    <div className=''>
      <Header/>

      <div className='m-2'></div>

      <Banner />
      
      <main className='max-w-7xl mx-auto px-8 sm:px-16'>

        <Trips trips={trips} setTrips={setTrips} decreaseStat={decreaseStat}/>

        <Visited stats={stats}/>

      </main>
      <Footer/>
    </div>
  )
}

export default ProtectedRoute(Home);