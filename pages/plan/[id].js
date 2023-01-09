import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Map from '../../components/Map'
import { useRouter } from 'next/router';
import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';


function PlanPage({trip}) {
  const router = useRouter();
  const id = router.query.id

  const convertDate = (date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.slice(8,10) //8 and 9
    const monthDec = date.slice(5,7)
    const monthIndex = parseInt(date.slice(5,7)); //5 and 6
    const year = date.slice(0,4)//0-3 index
    const month = monthNames[monthIndex];
    return `${day}/${monthDec}`
  }

    //empty fields to add

    //update trip button to mongodb

    //mapbox on the side https://docs.mapbox.com/mapbox-gl-js/guides/install/
  console.log(trip)
  return (
    <div className='bg-white'>
        <Header/>
        <main className='flex relative'>
          <div className='flex-col px-6 pt-6 w-1/2'>
            <div className='bg-gray-100 w-fit rounded-xl p-4 shadow-md'>
              <h2 className='text-4xl font-bold'>Trip to {trip.location} </h2>
              <p className='text-gray-500 font-semibold py-2'>{convertDate(trip.startDate)} - {convertDate(trip.endDate)}</p>
            </div>
            <section className='mb-5 mt-2 flex flex-col'>
              <label for="notes" className='text-2xl font-bold mb-3'>Notes</label>
              <textarea for="notes" 
                className="p-4 outline-none bg-gray-100 rounded-xl resize-none overflow-y-auto" 
                rows="2" 
                placeholder='Write anything here eg. Tips and tricks, things to note'
              
              />
            </section>

            <section className='mb-10'>
              <h2 className='text-2xl font-bold'>Places to Visit</h2>
            </section>

            <section className='my-10'>
              <h2 className='text-2xl font-bold'>Itinerary</h2>
            </section>

            <section className='my-10'>
              <h2 className='text-2xl font-bold'>Budget</h2>
            </section>
          </div>
          <div className='hidden xl:inline-flex xl:min-w-[600px]'>
            <Map/>
          </div>
        </main>
    </div>
  )
}

export async function getStaticPaths(){
  return{
    paths:[

    ],
    fallback:true
  }
}

export async function getStaticProps({ params }) {
  const { db } = await connectToDatabase();
  const data = await db.collection('trips')
  .findOne({
    _id: ObjectId(params.id)
  })

  console.log(data)

  return{
    props: {trip: JSON.parse(JSON.stringify(data))},
    revalidate: 1
  }
}
export default PlanPage