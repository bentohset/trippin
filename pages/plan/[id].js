import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Map from '../../components/Map'
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
        <main className='flex relative'>
          <div className='flex-col px-6 space-y-20 w-1/2'>
            <h1>Trip to {id} </h1>
            <p>Date</p>

            <section>
              <h1>Notes</h1>
            </section>

            <section>
              <h1>Places to Visit</h1>
            </section>

            <section>
              <h1>Itinerary</h1>
            </section>

            <section>
              <h1>Budget</h1>
            </section>
          </div>
          <div className='hidden xl:inline-flex xl:min-w-[600px]'>
            <Map/>
          </div>
        </main>
        <Footer/>
    </div>
  )
}

export default PlanPage