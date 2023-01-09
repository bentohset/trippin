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

  const convertDateFull = (date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dateObject = new Date(date)
    const dayOfWeek = dateObject.getDay()
    const day = date.slice(8,10) //8 and 9
    const monthDec = date.slice(5,7)
    const monthIndex = parseInt(date.slice(5,7)); //5 and 6
    const year = date.slice(0,4)//0-3 index
    const month = monthNames[monthIndex-1];
    return `${dayNames[dayOfWeek]}, ${day} ${month}`
  }
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
  
  const startTimestamp = new Date(trip.startDate).getTime();
  const endTimestamp = new Date(trip.endDate).getTime();

  // Calculate the difference in timestamps
  const timestampDifference = Math.abs(startTimestamp - endTimestamp);

  // Convert the timestamp difference to days
  const numDays = (timestampDifference / (1000 * 60 * 60 * 24))+1;

  // Create an array of dates
  const dates = Array.from({ length: numDays }).map((_, index) => {
    const date = new Date(startTimestamp + index * (1000 * 60 * 60 * 24));
    return date.toISOString().split('T')[0];
  });

  console.log(dates)
    //empty fields to add

    //update trip button to mongodb

    //mapbox on the side https://docs.mapbox.com/mapbox-gl-js/guides/install/
    //sample yt vid https://www.youtube.com/watch?v=aAupumVpqcE
    //https://www.youtube.com/watch?v=MOqkfQIMdLE and github repo https://github.com/kukicado/building-modern-app-with-nextjs-and-mongodb



  return (
    <div className='bg-white'>
        <Header/>
        <main className='flex relative'>
          <div className='flex-col px-6 pt-6 w-1/2'>

            <div className='bg-gray-100 w-fit rounded-xl p-4 shadow-md'>
              <h2 className='text-4xl font-bold'>Trip to {trip.location} </h2>
              <p className='text-gray-500 font-semibold py-2'>{convertDate(trip.startDate)} - {convertDate(trip.endDate)}</p>
            </div>

            <section className='mb-5 mt-2 flex flex-col border-b-2'>
              <label for="notes" className='text-3xl font-bold mb-3'>Notes</label>
              <textarea for="notes" 
                className="p-4 mb-8 outline-none bg-gray-100 rounded-xl resize-none overflow-y-auto" 
                rows="2" 
                placeholder='Write anything here eg. Tips and tricks, things to note'
              
              />
            </section>

            <section className='mb-10 border-b-2'>
              <h2 className='text-3xl font-bold'>Places to Visit</h2>
            </section>

            <section className='my-10'>
              <h2 className='text-3xl font-bold mb-4'>Itinerary</h2>
              <div className='space-y-5'>
                {dates.map((date)=>(
                  <div className="w-full p-2 border-b-2" key={date}>
                    <h3 className='font-bold text-xl'>{convertDateFull(date)}</h3>
                  </div>
                  
                ))}
              </div>
            </section>

            <section className='my-10'>
              <h2 className='text-2xl font-bold'>Budget</h2>
              <div>
                <div>
                  <p>Hi</p>
                </div>
              </div>
            </section>
          </div>
          <div className='hidden xl:inline-flex xl:min-w-[600px]'>
            <Map/>
          </div>
        </main>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const { db } = await connectToDatabase();
  const data = await db.collection('trips')
  .findOne({
    _id: ObjectId(params.id)
  })


  return{
    props: {trip: JSON.parse(JSON.stringify(data))},
  }
}
export default PlanPage