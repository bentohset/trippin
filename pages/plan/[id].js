import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useRouter } from 'next/router';

function PlanPage() {
  const router = useRouter();
  const id = router.query.id


    //get trip and display current info or find a way to pull through trip info

    //empty fields to add

    //update trip button to mongodb

    //mapbox on the side https://docs.mapbox.com/mapbox-gl-js/guides/install/

  return (
    <div className='bg-white'>
        <Header/>
        <main className=''>
            <h1>Trip to {id} </h1>
        </main>
        <Footer/>
    </div>
  )
}

export default PlanPage