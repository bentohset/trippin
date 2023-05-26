import React, { useState, useEffect, useCallback } from "react";
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
    const [formData, setFormData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        notes: '',
        places: [],
        itinerary: [], //array of objects for each date -> each date has places[], budget[] in ascending order
        totalBudget: 0,
    })
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                let dev = process.env.NODE_ENV !== 'production';
                const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/trips/form/${id}`
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json()
                setFormData(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
        console.log(formData)
    }, []);
    

    const startTimestamp = new Date(formData.startDate).getTime();
    const endTimestamp = new Date(formData.endDate).getTime();
    // Calculate the difference in timestamps
    const timestampDifference = Math.abs(startTimestamp - endTimestamp);

    // Convert the timestamp difference to days
    const numDays = timestampDifference / (1000 * 60 * 60 * 24) + 1;
    // Create an array of dates
    const dates = Array.from({ length: numDays }).map((_, index) => {
        const date = new Date(startTimestamp + index * (1000 * 60 * 60 * 24));
        return date.toISOString().split("T")[0];
    });

    const [places, setPlaces] = useState([])
    function handleListUpdate(updatedList) {
        setPlaces(updatedList);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))

        // clearTimeout(timer);
        // setTimer(setTimeout(autoSave, 1000));    //500ms after user stops typing
    }

    const autoSave = async () => {
        let dev = process.env.NODE_ENV !== 'production';
        const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/trips/${id}`
        const response = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        console.log(response)
        let data = await response.json()
        .then(data => {
            if (response.status === 200) {
                console.log("save success")
                console.log(data)
            } else {
                console.log(response.message)
            }
        })

    }


    const debouncedSaveData = useCallback(
        debounce((data) => {
            autoSave(data);
        }, 2000), [formData]
    );

    function debounce(func, delay) {
        let timer;
        const debounced = (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
        debounced.cancel = () => {
            clearTimeout(timer);
        };

        return debounced
    }
    useEffect(() => {
        return () => {
            debouncedSaveData.cancel();
        };
    }, [debouncedSaveData]);

    useEffect(() => {
        debouncedSaveData(formData);
    
    }, [formData, debouncedSaveData]);

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
                    
                        <div className="bg-gray-100 w-fit rounded-xl p-4 shadow-md mb-4">
                            {/* <h2 className="text-4xl font-bold">{formData.title} </h2> */}
                            <input
                                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 outline-none font-bold text-4xl resize-none overflow-y-auto"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                            <p className="text-gray-500 font-semibold py-2 mx-3">
                                {convertDate(formData.startDate)} - {convertDate(formData.endDate)}
                            </p>
                            
                        </div>
                        <section className="mb-5 mt-5 flex flex-col border-b-2">
                            <label htmlFor="notes" className="text-3xl font-bold mb-3">
                                Notes
                            </label>
                            <textarea
                                htmlFor="notes"
                                className="p-4 mb-8 outline-none bg-gray-100 rounded-xl resize-none overflow-y-auto"
                                rows="2"
                                placeholder="Write anything here eg. Tips and tricks, things to note"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </section>

                        <section className="mb-10 border-b-2">
                            <h2 className="text-3xl font-bold">Places to Visit</h2>
                            <VisitList list={formData.places} onListUpdate={handleListUpdate}/>
                        </section>

                        <section className="my-10">
                            <h2 className="text-3xl font-bold mb-4">Itinerary</h2>
                            <div className="space-y-5">
                                {dates && dates.map((date, index) => (
                                    <div className="w-full py-2 border-b-2" key={index}>
                                        <h3 className="font-bold text-xl">
                                            {convertFullDate(date)}
                                        </h3>
                                        <input
                                            type="number"
                                            placeholder="Budget"
                                        />
                                        <h2>TODO</h2>
                                        {/* TODO: add budget, and find out how to store all child states in parent for saving data */}
                                        {formData.places && <Itinerary list={formData.places}/>}
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

        const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/trips/form/${params.id}`
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
