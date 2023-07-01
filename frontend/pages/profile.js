import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/auth";
import { useRouter } from 'next/router';
import Header from "../components/Header";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import ProfileTripCard from "../components/ProfileTripCard";

const profile = ({ initialUser }) => {
    const { cookies } = useAuth()
    const [user, setUser] = useState(initialUser)
    const [username, setUsername] = useState(initialUser.username)
    const [email, setEmail] = useState(initialUser.email)
	const [openEdit, setOpenEdit] = useState(false)
	const [save, setSave] = useState(false)
	const [trips, setTrips]  = useState([])

	const router = useRouter()

    useEffect(() => {
		updateProfile()
		setSave(false)
    }, [save]);

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

    const updateProfile = async () => {
		let dev = process.env.NODE_ENV !== 'production';
		const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/user/${cookies.id}`
		const response = await fetch(url, {
			body: JSON.stringify(user),
			method: 'PATCH',
			headers: {
			'Content-Type': 'application/json',
			}
		})
		const data = await response.json()
    }

    const handleOpenEdit = () => {
		setOpenEdit(true)
    }

    const handleCloseEdit = () => {
		setOpenEdit(false)
		setUsername(user.username)
    }

	const handleSaveEdit = async () => {
		setOpenEdit(false)
		setUser(prev => ({
			...prev,
			username: username
		}))
		setSave(true)
	}

    const handleOpenSettings = () => {

    }
    
  return (
    <div className='h-full bg-white'>
        <Header/>
        <div className='gap-4 h-screen bg-white flex flex-col items-center p-16'>
			<h1 className="font-bold text-2xl mt-6 ">Profile</h1>
            <section className="px-8 py-4 bg-white flex flex-row justify-between items-center gap-4 w-fit border-2 rounded-3xl">
				<div className="flex flex-col mr-6">
					<p className="font-bold">@{user.username}</p>
					<p className="text-gray-600 text-sm italic">{user.email}</p>
					<p className="font-bold mt-2">Trips:</p>
					<p className="text-2xl">{user.trips.length}</p>
              	</div>
              	<div className="flex flex-col items-center justify-center gap-2 mt-4">
					<button className='bg-gray-100 text-sm rounded-xl p-2 px-3 font-semibold hover:bg-gray-200' onClick={()=>{handleOpenEdit()}}>Edit</button>
					<button className='bg-gray-100 text-sm rounded-xl p-2 px-3 font-semibold hover:bg-gray-200' onClick={()=>{handleOpenSettings()}}>Settings</button>
              	</div>
            </section>
			<h1 className="font-bold text-xl">Your Trips</h1>
            <section className="flex flex-col w-full h-fit border-2 rounded-xl items-start">
				{trips ? 
				(
					trips.map((trip, index)=>(
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
					/>
				))
				):(
					<p>You have no trips. Add a trip!</p>
				)}
            </section>

			
			<Dialog open={openEdit} onClose={handleCloseEdit}>
				<DialogTitle>Edit Profile</DialogTitle>
				<DialogContent
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
				<p className='font-semibold mr-1 mt-2 inline py-1'>Username</p>
				<input
					className='bg-gray-200 mt-2 w-full rounded-lg py-1 px-2 text-gray-500 outline-none font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
					type='text'
					placeholder='Username'
					value={username}
					onChange={(e)=>{setUsername(e.target.value)}}
				/>
				</DialogContent>
				<DialogActions>
				<Button onClick={()=>{handleCloseEdit()}}>Cancel</Button>
				<Button onClick={()=>{handleSaveEdit()}}>Save</Button>
				</DialogActions>
			</Dialog>
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

