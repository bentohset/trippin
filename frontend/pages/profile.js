import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/auth";
import Header from "../components/Header";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useRouter } from "next/router";
import ProfileTrips from "../components/ProfileTrips";
import ProfileCard from "../components/ProfileCard";
import useLocalStorage from "../hooks/useLocalStorage";

const profile = ({ initialUser }) => {
  const { cookies } = useAuth()
  const [user, setUser] = useState(initialUser)
	const [trips, setTrips]  = useState([])
  const { read } = useLocalStorage('trips', [])

	const router = useRouter()

  // useEffect(()=>{
  //   setUser((prevUser) => {
  //     const newUser = {
  //       ...prevUser,
  //       trips: trips.map((obj) => obj._id)
  //     }
  //     console.log(newUser)
  //     return newUser
  //   })
  // }, [user])

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
			} catch (error) {
				console.log(error)
			}
		}
    const fetchLocalData = () => {
      const data = read()
      setTrips(data)
      setUser((prevUser) => {
        let newUser = prevUser
        newUser.trips = data.map(obj => obj._id)
        console.log("newuser")
        console.log(newUser)
        return newUser
      })
      console.log(user)
    }

    if (cookies.role == "guest") {
      fetchLocalData()
      console.log(user)
    } else {
      fetchData()
    } 
		

	}, [])
    
  return (
    <div className='h-full bg-white'>
        <Header/>
        <div className='gap-4 h-screen bg-white flex flex-col items-center p-16'>

			<ProfileCard initialUser={initialUser} user={user} setUser={setUser}/>
			<ProfileTrips trips={trips} setTrips={setTrips} setUser={setUser}/>

        </div>
    </div>
  )
}

export async function getServerSideProps(ctx) {
    const cookies = ctx.req.cookies
  try {
    let data;
    if (cookies.role === "guest") {
      data = {
        userId: '',
        username: 'Guest',
        email: '',
        trips: [],
      }
    } else {
      let dev = process.env.NODE_ENV !== 'production';
      const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/user/${cookies.id}`
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      })
      data = await response.json()
    }
    

    return {
      props: {
        initialUser: data,
      }
    }
  } catch (error) {
      console.log(error)
      return {
        props: {
          trips: [],
        }
      }
  }
}

export default profile

