import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Map from "../../components/Map";
import HeaderPlan from "../../components/HeaderPlan";
import VisitList from "../../components/VisitList";
import Itinerary from "../../components/Itinerary";
import { useRouter } from "next/router";
import { convertDate, convertFullDate } from "../../utils/convertDate";

function PlanPage({ trip }) {
    const router = useRouter();
    const id = router.query.id;

    const startTimestamp = new Date(trip.startDate).getTime();
    const endTimestamp = new Date(trip.endDate).getTime();

    // Calculate the difference in timestamps
    const timestampDifference = Math.abs(startTimestamp - endTimestamp);

    // Convert the timestamp difference to days
    const numDays = timestampDifference / (1000 * 60 * 60 * 24) + 1;

    // Create an array of dates
    const dates = Array.from({ length: numDays }).map((_, index) => {
        const date = new Date(startTimestamp + index * (1000 * 60 * 60 * 24));
        return date.toISOString().split("T")[0];
    });

    const [notes, setNotes] = useState('');
    const [places, setPlaces] = useState([]);

    console.log(dates);
    
    function handleSave() {

    }

    function handleListUpdate(updatedList) {
        setPlaces(updatedList);
    }

    //mapbox on the side https://docs.mapbox.com/mapbox-gl-js/guides/install/
    //sample yt vid https://www.youtube.com/watch?v=aAupumVpqcE
    //https://www.youtube.com/watch?v=MOqkfQIMdLE and github repo https://github.com/kukicado/building-modern-app-with-nextjs-and-mongodb

    return (
        <div className="bg-white">
            <main className="flex">
                
                <div className="flex-col w-1/2">
                    <HeaderPlan 
                        handleOnClick={()=>{handleSave}}
                    />
                    
                    <div className="mt-14 flex-col px-6 pt-6 w-full">
                    
                        <div className="bg-gray-100 w-fit rounded-xl p-4 shadow-md">
                            <h2 className="text-4xl font-bold">Trip to {trip.location} </h2>
                            <p className="text-gray-500 font-semibold py-2">
                                {convertDate(trip.startDate)} - {convertDate(trip.endDate)}
                            </p>
                        </div>
                        <section className="mb-5 mt-2 flex flex-col border-b-2">
                            <label htmlFor="notes" className="text-3xl font-bold mb-3">
                                Notes
                            </label>
                            <textarea
                                htmlFor="notes"
                                className="p-4 mb-8 outline-none bg-gray-100 rounded-xl resize-none overflow-y-auto"
                                rows="2"
                                placeholder="Write anything here eg. Tips and tricks, things to note"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </section>

                        <section className="mb-10 border-b-2">
                            <h2 className="text-3xl font-bold">Places to Visit</h2>
                            <VisitList list={places} onListUpdate={handleListUpdate}/>
                        </section>

                        <section className="my-10">
                            <h2 className="text-3xl font-bold mb-4">Itinerary</h2>
                            <div className="space-y-5">
                                {dates.map((date) => (
                                    <div className="w-full p-2 border-b-2" key={date}>
                                        <h3 className="font-bold text-xl">
                                            {convertFullDate(date)}
                                        </h3>
                                        <input
                                            type="number"
                                            placeholder="Budget"
                                        />
                                        <h2>TODO</h2>
                                        {/* TODO: add budget, and find out how to store all child states in parent for saving data */}
                                        <Itinerary list={places}/>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="my-10">
                            <h2 className="text-2xl font-bold">Budget</h2>
                            <div>
                                <div>
                                    <p>Hi</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="fixed right-0 w-1/2 h-screen sm:hidden xl:inline-flex xl:min-w-[600px]">
                    <Map/>
                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps({ params }) {
    try {
        let dev = process.env.NODE_ENV !== 'production';

        const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/trips/${params.id}`
        const response = await fetch(url)
        const data = await response.json();
        console.log(data)

        return {
            props: {
                trip: data,
            }
        }
    } catch (error) {
        console.log(error)
        return {
            props: {
                trip: []
            }
        }
    }
}
export default PlanPage;
