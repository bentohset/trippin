// itinerary for each day
// list is the total list of ALL locations for the trip across everyday

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Select from 'react-select';
import TextareaAutosize from 'react-textarea-autosize';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

//formData.itinerary[dateIndex]: {cost:[], dateIndex, notes:[], locations:[]}

function Itinerary({ id, dateIndex, list, setSaving, currency,  updateTotal, setData }) {
    const [selectedItems, setSelectedItems] = useState(list.itinerary[dateIndex].locations);
    const [options, setOptions] = useState([]);
    const [costsDraft, setCostsDraft] = useState([])
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

    //when places is removed from the places to visit array
    //checks if selected items not in options, remove selected
    useEffect(() => {
        // let index = -1

        // for (let i = 0; i < list.itinerary[dateIndex].locations.length; i++) {
        //     if (list.places.some(obj => obj.name === list.itinerary[dateIndex].locations[i].label)) {
        //         index = i
        //         console.log(list.places)
        //         console.log(list.itinerary[dateIndex].locations[i])
        //     }
        // }
        if (list.itinerary[dateIndex].locations) {
            // console.log('use')
            // console.log(list.places)
            // console.log(list.itinerary[dateIndex].locations)
            let ind = list.itinerary[dateIndex].locations?.findIndex(obj => !list.places.some(place => place.name === obj.label))
            //returns ind = -1 if no differences
            if (ind != -1 && list.itinerary[dateIndex].locations.length) {
                //remove all instances of the option
                console.log("options remove", ind)
                //find index in itinerary

                handleRemove(ind)
                ind = -1
            }
        }
        

        
        
    }, [options])
    

    const onTextAreaChange = (index, value) => {
        let editedNotes = list.itinerary[dateIndex].notes

        editedNotes[index] = value
        const newObj = {
            ...list.itinerary[dateIndex],
            notes: editedNotes
        }
        const newArr = [
            ...list.itinerary.splice(0, dateIndex),
            newObj,
            ...list.itinerary.splice(dateIndex + 1),
        ]
        setData((prev) => ({
            ...prev,
            itinerary: newArr
        }))
    }

    //append place to locations array at itinerary dateindex
    //to initialise empty cost and empty note
    const handleItemSelect = (value) => {
        setSelectedItems(value);
        let itineraryObj = list.itinerary[dateIndex]
        const newLocation = value
        const newCost = [
            ...itineraryObj.cost,
            0
        ]
        const newNotes = [
            ...itineraryObj.notes,
            ""
        ]
        itineraryObj.locations = newLocation
        itineraryObj.cost = newCost
        itineraryObj.notes = newNotes

        const newArray = [
            ...list.itinerary.splice(0, dateIndex),
            itineraryObj,
            ...list.itinerary.splice(dateIndex+1),
        ]


        setData((prev) => ({
            ...prev,
            itinerary: newArray
        })

        )
        setCostsDraft(prev => [...prev, 0])
    }

    //remove from itinerary, delete at index from cost, notes and locations
    const handleRemove = (index) => {
        updateTotal(0, list.itinerary[dateIndex].cost[index])
        // setSelectedItems(selectedItems.filter((i, indx) => indx !== index));

        let itineraryObj = list.itinerary[dateIndex]

        const newLocation = itineraryObj.locations.filter((i, indx) => indx !== index)
        const newCost = itineraryObj.cost.filter((i, indx) => indx !== index)
        const newNotes = itineraryObj.notes.filter((i, indx) => indx !== index)

        itineraryObj.locations = newLocation
        itineraryObj.cost = newCost
        itineraryObj.notes = newNotes

        const newArray = [
            ...list.itinerary.splice(0, dateIndex),
            itineraryObj,
            ...list.itinerary.splice(dateIndex+1),
        ]

        setData((prev) => ({
            ...prev,
            itinerary: newArray
        }))

        setCostsDraft(prev => {
            const newArray = [...prev]
            newArray.splice(index, 1)
            return newArray
        })

    };

    const handleOpen = (index) => {
        setOpenCost(index);
        if (list.itinerary[dateIndex].cost[index]) {
            currentCost.current = list.itinerary[dateIndex].cost[index]
        } else {
            currentCost.current = 0
        }
    };
    
    //close and cancel
    const handleClose = () => {
        setCostsDraft(list.itinerary[dateIndex].cost)
        setOpenCost('');
    };


    //close and save cost
    const handleCostSave = (index) => {
        if (costsDraft[index] === '') {

            let itineraryObj = list.itinerary[dateIndex]

            itineraryObj.cost[index] = 0

            const newArray = [
                ...list.itinerary.splice(0, dateIndex),
                itineraryObj,
                ...list.itinerary.splice(dateIndex+1),
            ]

            setData((prev) => ({
                ...prev,
                itinerary: newArray
            }))
            updateTotal(0, currentCost.current)
        } else {
            let itineraryObj = list.itinerary[dateIndex]

            itineraryObj.cost[index] = costsDraft[index]

            const newArray = [
                ...list.itinerary.splice(0, dateIndex),
                itineraryObj,
                ...list.itinerary.splice(dateIndex+1),
            ]

            setData((prev) => ({
                ...prev,
                itinerary: newArray
            }))
            updateTotal(parseInt(costsDraft[index]), currentCost.current)
        }
        setOpenCost('');
        setCostsDraft(list.itinerary[dateIndex].cost)
    }

    const handleCostsDraftChange = (index, value) => {
        const regex = /^[0-9\b]+$/;
        if (value === '') {
            setCostsDraft(prev => {
                const updated = [...prev]
                updated[index] = 0
                return updated
            })
        } 
        if (regex.test(value)) {
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
        if (!isNumberKey && !isBackspaceKey) {
          event.preventDefault(); // Prevent typing numbers
        }
    };


  return (
    <div className='flex-1 w-full mt-4'>
        <div className='flex-1 space-y-4'>
            {(list.itinerary[dateIndex].locations.length === 0) ? (<h2 className='font-bold text-gray-400'>Add a place to this day from your list</h2>):
            list.itinerary[dateIndex].locations.map((item, index) => (
                    <div key={index} className="bg-gray-100 rounded-xl p-4 text-sm font-semibold flex-grow flex-col">
                        <div className='flex flex-row justify-between'>
                            <p>{item.label}</p>
                            <button onClick={()=>handleRemove(index)} className="font-semibold text-gray-400 self-end hover:text-gray-600">Remove</button>
                        </div>
                   
                        <TextareaAutosize
                            className='resize-none bg-white outline-none mt-2 mb-2 font-normal p-2 text-gray-500 w-full rounded-lg max-h-58 h-auto flex-shrink-0'
                            placeholder='Add any notes here'
                            onChange={(e) => onTextAreaChange(index, e.target.value)}
                            value={list.itinerary[dateIndex].notes[index]}

                        />
                        <button
                            className='hover:bg-gray-200 rounded-lg px-2 py-1 text-xs'
                            onClick={()=>{handleOpen(index)}}
                        >
                            {list.itinerary[dateIndex].cost[index] ? `${currency} ${list.itinerary[dateIndex].cost[index]}` : `$ Add Cost`}
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
            value={list.itinerary[dateIndex].locations} 
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