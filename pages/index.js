import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'
import Header from '../components/Header'
import Banner from '../components/Banner'
import SmallCard from '../components/SmallCard'
import Footer from '../components/Footer'

import { useEffect } from 'react';

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


export default function Home({trips}) {
  const router = useRouter()
  
  
  return (
    <div className=''>
      <Head>
        <title>Trip Planner App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> 
      {/* Header */}
      <Header/>


      {/* Banner */}
      <Banner />
      
      <main className='max-w-7xl mx-auto px-8 sm:px-16'>
        
        <section className='pt-6'>
          <h2 className='text-4xl font-semibold pb-5'>Your Trips</h2>
    
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {trips.map(({_id, img, location, startDate, endDate})=>(
              <SmallCard 
              key={_id}
              location={location} startDate={startDate} endDate={endDate}/>
            ))}
            </div>
        </section>
        
        <section>
          <h2 className='text-4xl font-semibold py-8'>
            Visited
          </h2>
          <div className='flex justify-center text-white items-center w-full h-[500px] bg-gray-500 mb-10'>
              Map checklist of visited locations
          </div>
        </section>

        <section>
          <h2 className='text-4xl font-semibold py-8'>Devs to do list</h2>
          <ol className='font-semibold text-xl p-2 mb-10 space-y-4 list-disc'>
            <li>convert date object to string for home page</li>
            <li>create page for [id] with features</li>
            <li>addtrip dropdown with autocomplete location for [lt:lg] to pull through to center map</li>
            <li>userauth with auth0 + authentication flow</li>
            <li>restyle home page</li>
          </ol>
        </section>
      </main>
      <Footer/>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  // get the current environment
  let dev = process.env.NODE_ENV !== 'production';
  let { DEV_URL, PROD_URL } = process.env;

  // request posts from api
  let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/trips`);
  // extract the data
  let data = await response.json();

  return {
      props: {
          trips: data['message'],
      },
  };
}