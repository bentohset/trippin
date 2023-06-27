// itinerary for each day
// list is the total list of ALL locations for the trip across everyday

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Select from 'react-select';
import TextareaAutosize from 'react-textarea-autosize';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

function Itinerary({ id, dateIndex, list, setSaving, currency,  updateTotal }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [options, setOptions] = useState([]);
    const [notes, setNotes] = useState([]);
    const [costs, setCosts] = useState(Array.from({length: 25}, () => ''))
    const [costsDraft, setCostsDraft] = useState(Array.from({length: 25}, () => ''))
    const [openCost, setOpenCost] = useState('')

    const currentCost = useRef(0)
    // to set options from places in parent formdata
    useEffect(() => {
        setOptions(list.places.map((item, index) => {
            return {
                value: item.address,
                label: item.name
            }
        }))

    }, [list.places])

    useEffect(() => {
        console.log("update")
      //if selected items not in options, remove selected
        let index = -1
        for (let i = 0; i < selectedItems.length; i++) {
            if (!options.includes(selectedItems[i])) {
                index = i
            }
        }
        console.log(index)
        if (index != -1) {
            setNotes(prev => {
                const newArray = [...prev]
                newArray.splice(index, 1)
                return newArray
            })
            setSelectedItems(prev => {
                const newArray = [...prev]
                newArray.splice(index, 1)
                return newArray
            })
            setCosts(prev => {
                const newArray = [...prev]
                newArray.splice(index, 1)
                return newArray
            })
        }
        

    }, [options])
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                let dev = process.env.NODE_ENV !== 'production';
                const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/trips/${id}/${dateIndex}/itinerary`
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json()
                // console.log("fetch itinerary")
                // console.log(data)
                setSelectedItems(data.locations)
                setNotes(data.notes)
                setCosts(data.cost)
                setCostsDraft(costs)
            } catch (error) {
                console.log(error)
            }
        }
        return () => {
            fetchData()
        }
    }, [])
    
    const autoSave = async () => {
        console.log("savingc")
        console.log(costs)
        setSaving(true)
        let dev = process.env.NODE_ENV !== 'production';
        const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/trips/${id}/${dateIndex}/itinerary`
        const response = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({
                "notes": notes,
                "location": selectedItems,
                "cost": costs
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        console.log(response)
        let data = await response.json()
        .then(data => {
            if (response.status === 200) {
                console.log("save successc")
                console.log(data)
                setSaving(false)
                setCostsDraft(costs)
            } else {
                console.log(response.message)
            }
        })
    }

    const debouncedSaveData = useCallback(
        debounce((data) => {
            // console.log("debounce1c")
            autoSave(data);
        }, 3000), [notes, selectedItems, costs]
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
        // console.log("debounce3")
        return () => {
            debouncedSaveData.cancel();
        };
    }, [debouncedSaveData]);

    useEffect(() => {
        // console.log("debounce2")
        debouncedSaveData(notes);
    
    }, [notes, selectedItems, costs, debouncedSaveData]);
    
    const onTextAreaChange = (index, value) => {
        setNotes(prev => {
            const updated = [...prev]
            updated[index] = value
            return updated
        })
    }

    const handleItemSelect = (value) => {
        // console.log("onchanges")
        setSelectedItems(value);
    }

    const handleRemove = (item, index) => {
        console.log("remove")
        updateTotal(0, costs[index])
        setSelectedItems(selectedItems.filter(i => i !== item));
        setNotes(prev => {
            const newArray = [...prev]
            newArray.splice(index, 1)
            return newArray
        })
        setCosts(prev => {
            const newArray = [...prev]
            newArray.splice(index, 1)
            return newArray
        })
        setCostsDraft(prev => {
            const newArray = [...prev]
            newArray.splice(index, 1)
            return newArray
        })
    }

    const handleOpen = (index) => {
        setOpenCost(index);
        if (costs[index]) {
            currentCost.current = costs[index]
        } else {
            currentCost.current = 0
        }
        // console.log('open')
        // console.log(costs[index])
        // console.log(currentCost.current)     
    };
    
    //close and cancel
    const handleClose = () => {
        console.log("close")
        setCostsDraft(costs)
        setOpenCost('');
    };


    //close and save cost
    const handleCostSave = (index) => {
        console.log("save")
        if (costsDraft[index] === '') {
            setCosts(prev => {
                const updated = [...prev]
                updated[index] = ''
                return updated
            })
            console.log(currentCost.current)
            updateTotal(0, currentCost.current)
        } else {
            setCosts(prev => {
                const updated = [...prev]
                updated[index] = costsDraft[index]
                return updated
            })
            console.log(costsDraft[index])
            updateTotal(parseInt(costsDraft[index]), currentCost.current)
        }
        setOpenCost('');
        setCostsDraft(costs)
    }

    const handleCostsDraftChange = (index, value) => {
        const regex = /^[0-9\b]+$/;
        if (value === '') {
            setCostsDraft(prev => {
                const updated = [...prev]
                updated[index] = ''
                return updated
            })
        } 
        if (regex.test(value)) {
            console.log(costsDraft)
            setCostsDraft(prev => {
                const updated = [...prev]
                updated[index] = parseInt(value)
                return updated
            })
        }
    }

    const handleKeyDownCostDraft = (event) => {
        const key = event.key;
        const isNumberKey = /^[0-9]$/.test(key); // Check if the key is a number (0-9)
        const isBackspaceKey = key === 'Backspace';
        // if (isBackspaceKey && budget.length <= 1) {
        //     setBudget('')
        // }
        if (!isNumberKey && !isBackspaceKey) {
          event.preventDefault(); // Prevent typing numbers
        }
    };


  return (
    <div className='flex-1 w-full mt-4'>
        <div className='flex-1 space-y-4'>
            {(selectedItems.length === 0) ? (<h2 className='font-bold text-gray-400'>Add a place to this day from your list</h2>):
                selectedItems.map((item, index) => (
                    <div key={index} className="bg-gray-100 rounded-xl p-4 text-sm font-semibold flex-grow flex-col">
                        <div className='flex flex-row justify-between'>
                            <p>{item.label}</p>
                            <button onClick={()=>handleRemove(item, index)} className="font-semibold text-gray-400 self-end hover:text-gray-600">Remove</button>
                        </div>
                   
                        <TextareaAutosize
                            className='resize-none bg-white outline-none mt-2 mb-2 font-normal p-2 text-gray-500 w-full rounded-lg max-h-58 h-auto flex-shrink-0'
                            placeholder='Add any notes here'
                            onChange={(e) => onTextAreaChange(index, e.target.value)}
                            value={notes[index]}

                        />
                        {/* <span className='font-semibold mr-1'>$</span>
                        <input
                            className='mt-2 w-12 rounded-lg py-1 px-2 text-gray-500 outline-none font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                            type='number'
                            pattern="^-?[0-9]\d*\.?\d*$"
                            placeholder='Cost'
                            value={costs[index]}
                            onChange={(e) => onCostChange(index, e.target.value)}
                            onKeyDown={handleKeyDownCost}
                        /> */}
                        <button
                            className='hover:bg-gray-200 rounded-lg px-2 py-1 text-xs'
                            onClick={()=>{handleOpen(index)}}
                        >
                            {costs[index] ? `${currency} ${costs[index]}` : `$ Add Cost`}
                        </button>
                        <Dialog open={openCost === index} onClose={handleClose}>
                            <DialogTitle>Set Cost</DialogTitle>
                            <DialogContent
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                            <p className='font-semibold mr-1 mt-2 inline py-1'>{currency}</p>
                            <input
                                className='bg-gray-200 mt-2 w-full rounded-lg py-1 px-2 text-gray-500 outline-none font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                type='number'
                                placeholder='Cost'
                                value={costsDraft[index] ? costsDraft[index] : ''}
                                onChange={(e)=>{handleCostsDraftChange(index, e.target.value)}}
                                onKeyDown={()=>{handleKeyDownCostDraft}}
                            />
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={()=>{handleClose()}}>Cancel</Button>
                            <Button onClick={()=>{handleCostSave(index)}}>Save</Button>
                            </DialogActions>
                        </Dialog>

                    </div>
                    
                ))
            }
            
        </div>

        <Select
            options={options}
            value={selectedItems} 
            placeholder="Choose places" 
            isMulti
            classNames={{
                control: () => "border border-gray-300 mt-4 rounded-xl",
            }}
            closeMenuOnSelect={false}
            onChange={event => handleItemSelect(event)} 
            controlShouldRenderValue={false}
            escapeClearsValue={false}
            components={{ ClearIndicator: () => null }}
            styles={{
                control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderRadius: '0.75rem',
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    backgroundColor: 'rgb(243 244 246)',
                    borderWidth: '0px',
                    color: 'rgb(156 163 175)',
                    outlineWidth: '0px'
                }),
                menu: (baseStyles, state) => ({
                    ...baseStyles,
                    borderRadius: '0.75rem'
                }),
            }}
        />
    </div>
  )
}

export default Itinerary