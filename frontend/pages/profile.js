import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/auth";
import Header from "../components/Header";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useRouter } from "next/router";
import ProfileTrips from "../components/ProfileTrips";
import ProfileCard from "../components/ProfileCard";

const profile = ({ initialUser }) => {
    const { cookies } = useAuth()
    const [user, setUser] = useState(initialUser)
	const [trips, setTrips]  = useState([])

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
			} catch (error) {
				console.log(error)
			}
		}

		fetchData()

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
    let dev = process.env.NODE_ENV !== 'production';
    const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/user/${cookies.id}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    const data = await response.json()

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

