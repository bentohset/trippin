import { useRouter } from 'next/router';
import Header from '../components/Header'
import Banner from '../components/Banner'
import ProtectedRoute from '../components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/auth';
import Footer from '../components/Footer';
import Visited from '../components/Visited';
import Trips from '../components/Trips';
import useLocalStorage from '../hooks/useLocalStorage';
import GuestModal from '../components/GuestModal';

const Home = () => {
	const { cookies } = useAuth()
	const [trips, setTrips]  = useState()
  const [stats, setStats] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const { data, read } = useLocalStorage('trips', [])
  const { data:isDismissed , toggleTrue: toggleDismissed } = useLocalStorage('guestDismiss', false)

	const router = useRouter()

  const handleModal = (x) => {
    setIsOpen(x)
  }

  const setDismissed = () => {
    toggleDismissed()
  }

  useEffect(()=> {
    if (cookies.role === "guest" && !isDismissed) {
      setOpenModal(true)
    }
    
  },[])
  
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

    const fetchLocalData = async () => {
      setTrips(data)
      setStats(getStats(data))
    }

    if (cookies.role == "guest") {
      console.log("guest")
      fetchLocalData()
      console.log(trips)
    } else {
      fetchData()
    }
		

		
	}, [cookies.role])

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
      <GuestModal isOpen={openModal} setIsOpen={setOpenModal} toggle={toggleDismissed}/>
    </div>
  )
}

export default ProtectedRoute(Home);