import React, { useState, useEffect, useCallback, useMemo } from "react";
import Map from "../../components/Map";
import HeaderPlan from "../../components/HeaderPlan";
import VisitList from "../../components/VisitList";
import Itinerary from "../../components/Itinerary";
import ProgressBar from "../../components/ProgressBar";
import { useRouter } from "next/router";
import { convertDate, convertFullDate } from "../../utils/convertDate";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import TextareaAutosize from 'react-textarea-autosize';
import { useLoadScript } from "@react-google-maps/api";

function PlanPage() {
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
        currency: '',
        center:[]
    })
    const [saving, setSaving] = useState(false)
    const [openBudget, setOpenBudget] = useState(false)
    const [budget, setBudget] = useState(0)
    const [totalCost, setTotalCost] = useState(0)
    const [currencyVal, setCurrencyVal] = useState('')
    const [openCurrency, setOpenCurrency] = useState(false) 

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
                if (response.status == 200) {
                    setFormData({...data})
                    setBudget(formData.totalBudget)
                    setCurrencyVal(formData.currency)
                }
                
            } catch (error) {
                console.log(error)
            }
        }
        if (id) {
            fetchData()
        }
        
        
    }, [id]);

    useEffect(() => {
        let total = 0
        formData.itinerary.forEach((obj) => {
            total += obj.cost.reduce((sum, value) => sum+value, 0)
        })
        setTotalCost(total)
      
    }, [formData])
    

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

    function handleListUpdate(updatedList) {
        setFormData((prevData) => ({
            ...prevData,
            places: updatedList
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleBudgetChange = (value) => {
        const regex = /^[0-9\b]+$/;
        if (value === '') {
            setBudget((prev) => prev)
        }
        if (regex.test(value)) {
            setBudget(value)
            
        }
    }

    const handleKeyDownBudget = (event) => {
        const key = event.key;
        const isNumberKey = /^[0-9]$/.test(key); // Check if the key is a number (0-9)
        const isBackspaceKey = key === 'Backspace';
        if (isBackspaceKey && budget.length <= 1) {
            setBudget('')
        }
        if (!isNumberKey && !isBackspaceKey) {
          event.preventDefault(); // Prevent typing numbers
        }
    };

    const handleOpen = () => {
        setOpenBudget(true);
    };
    
    const handleClose = () => {
        setOpenBudget(false);
        setBudget(formData.totalBudget)
    };

    const handleBudgetSave = () => {
        if (budget === '') {
            setBudget(1)
            setFormData((prev) => ({
                ...prev,
                totalBudget: 1
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                totalBudget: budget
            }))
        }
        setOpenBudget(false);
        autoSave()
    }

    const handleOpenCurrency = () => {
        setCurrencyVal(formData.currency)
        setOpenCurrency(true)
    }

    const handleCloseCurrency = () => {
        setCurrencyVal(formData.currency)
        setOpenCurrency(false)
    }

    const handleSaveCurrency = () => {
        if (currencyVal === '') {
            setFormData((prev) => ({
                ...prev,
                currency: '$'
            }))
            setCurrencyVal('$')
        } else {
            setFormData((prev) => ({
                ...prev,
                currency: currencyVal
            }))
        }
        setOpenCurrency(false)
        autoSave()
    }

    const updateTotalCost = (newVal, old) => {
        let val = 0
        if (newVal !== '') {
            val = newVal
        }
        setTotalCost(totalCost - old + val);
        
    }
    

    const autoSave = async () => {
        setSaving(true)
        if (!id && !formData.title) {
            console.log("autosave is nullified")
            return null
        }
        let dev = process.env.NODE_ENV !== 'production';
        const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/trips/${id}`
        const response = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        let data = await response.json()
        .then(data => {
            if (response.status === 200) {
                setSaving(false)
            } else {
                console.log(response.message)
            }
        })
    }


    const debouncedSaveData = useCallback(
        debounce((data) => {
            autoSave(data);
        }, 3000), [formData]
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

    const libraries = useMemo(() => ['places'], []);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAPS_KEY,
        libraries: libraries,
    }); 

    //mapbox on the side https://docs.mapbox.com/mapbox-gl-js/guides/install/
    //sample yt vid https://www.youtube.com/watch?v=aAupumVpqcE
    //https://www.youtube.com/watch?v=MOqkfQIMdLE and github repo https://github.com/kukicado/building-modern-app-with-nextjs-and-mongodb
    return formData.title && (
        <div className="bg-white">
            <main className="flex">
                
                <div className="flex-col sm:w-1/2 w-full">
                    <HeaderPlan 
                        saving={saving}
                    />
                    
                    <div className="mt-14 flex-col px-6 pt-6 w-full">
                    
                        <div className="bg-gray-100 w-full rounded-xl p-4 shadow-md mb-4">
                            <input
                                className="p-2 w-full rounded-xl bg-gray-100 hover:bg-gray-200 outline-none font-bold text-4xl resize-none overflow-y-auto"
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
                            <TextareaAutosize
                                className="p-4 mb-8 outline-none bg-gray-100 rounded-xl resize-none overflow-y-auto"
                                value={formData.notes}
                                minRows="2"
                                onChange={handleChange}
                                name="notes"
                                placeholder="Write anything here eg. Tips and tricks, things to note"
                            />
                        </section>

                        <section className="mb-10 border-b-2">
                            <h2 className="text-3xl font-bold">Places to Visit</h2>
                            <VisitList list={formData.places} onListUpdate={handleListUpdate} isLoaded={isLoaded} />
                        </section>

                        <section className="my-10">
                            <h2 className="text-3xl font-bold mb-4">Itinerary</h2>
                            <div className="space-y-5">
                                {dates && dates.map((date, index) => (
                                    <div className="w-full py-2 border-b-2" key={index}>
                                        <h3 className="font-bold text-xl">
                                            {convertFullDate(date)}
                                        </h3>
                                        {formData.places && 
                                        <Itinerary 
                                            list={formData} dateIndex={index} 
                                            id={id}
                                            setSaving={setSaving}
                                            currency={formData.currency}
                                            updateTotal={updateTotalCost}
                                        /> }
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="my-10">
                            <h2 className="text-2xl font-bold">Budget</h2>
                            <div>
                                <div className="flex flex-col gap-2 my-2">
                                    <p className="font-semibold text-2xl">Total Cost: {formData.currency} {totalCost}</p>
                                    <p className="text-gray-500 text-sm">Budget: {formData.currency} {formData.totalBudget}</p>
                                    <ProgressBar current={totalCost} max={formData.totalBudget}/>
                                </div>
                                <button className='bg-gray-100 mt-2 mr-1 rounded-xl p-2 px-3 font-semibold hover:bg-gray-200' onClick={()=>{handleOpen()}}>Edit Budget</button>
                                <button className='bg-gray-100 mt-2 mx-1 rounded-xl p-2 px-3 font-semibold hover:bg-gray-200' onClick={()=>{handleOpenCurrency()}}>Change Currency</button>
                                <Dialog open={openBudget} onClose={handleClose}>
                                    <DialogTitle>Set Budget</DialogTitle>
                                    <DialogContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                    <span className='font-semibold mr-1 inline'>$</span>
                                    <input
                                        className='mt-2 w-full rounded-lg py-1 px-2 text-gray-500 outline-none font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                        type='number'
                                        placeholder='Budget'
                                        name="totalBudget"
                                        value={budget}
                                        onChange={(e) => handleBudgetChange(e.target.value)}
                                        onKeyDown={handleKeyDownBudget}
                                    />
                                    </DialogContent>
                                    <DialogActions>
                                    <Button onClick={handleClose}>Cancel</Button>
                                    <Button onClick={handleBudgetSave}>Save</Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog open={openCurrency} onClose={handleCloseCurrency}>
                                    <DialogTitle>Set Currency</DialogTitle>
                                    <DialogContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >

                                    <input
                                        className='mt-2 w-full rounded-lg py-1 px-2 text-gray-500 outline-none'
                                        type='text'
                                        placeholder='Currency'
                                        name="currency"
                                        value={currencyVal}
                                        onChange={(e) => setCurrencyVal(e.target.value.toUpperCase())}
                                    />
                                    </DialogContent>
                                    <DialogActions>
                                    <Button onClick={handleCloseCurrency}>Cancel</Button>
                                    <Button onClick={handleSaveCurrency}>Save</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="fixed right-0 w-1/2 h-screen xl:inline-flex xl:min-w-[600px] invisible sm:visible">
                    <Map clat={formData.center[1]} clng={formData.center[0]} places={formData.places} isLoaded={isLoaded}/>
                </div>
            </main>
        </div>
    );
}

export default PlanPage;
