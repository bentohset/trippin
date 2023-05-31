// itinerary for each day
// list is the total list of ALL locations for the trip across everyday

import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import TextareaAutosize from 'react-textarea-autosize';

function Itinerary({ id, dateIndex, list, setSaving}) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [options, setOptions] = useState([]);
    const [notes, setNotes] = useState([])

    //TODO: create draggable divs that will rearrange the array of selected and options

    // to set options from places in parent formdata
    useEffect(() => {
        setOptions(list.places.map((item, index) => {
            return {
                value: item,
                label: item
            }
        }))

    }, [list.places])

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
                console.log("fetch itinerary")
                console.log(data)
                setSelectedItems(data.locations)
                setNotes(data.notes)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])
    
    const autoSave = async () => {
        console.log("savingc")
        setSaving(true)
        let dev = process.env.NODE_ENV !== 'production';
        const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/trips/${id}/${dateIndex}/itinerary`
        const response = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({
                "notes": notes,
                "location": selectedItems
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        console.log(notes)
        let data = await response.json()
        .then(data => {
            if (response.status === 200) {
                console.log("save successc")
                console.log(data)
                setSaving(false)
            } else {
                console.log(response.message)
            }
        })
    }

    const debouncedSaveData = useCallback(
        debounce((data) => {
            // console.log("debounce1c")
            autoSave(data);
        }, 3000), [notes, selectedItems]
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
    
    }, [notes, selectedItems, debouncedSaveData]);
    
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

    useEffect(() => {
        // Log the updated state whenever it changes
        console.log("selected are ")
        console.log(selectedItems);
      }, [selectedItems]);

    const handleRemove = (item, index) => {
        console.log("remove")

        setSelectedItems(selectedItems.filter(i => i !== item));
        setNotes(prev => {
            const newArray = [...prev]
            newArray.splice(index, 1)
            return newArray
        })
    }


  return (
    <div className='flex-1 w-full mt-4'>
        <div className='flex-1 space-y-4'>
            {(selectedItems.length === 0) ? (<h2 className='font-bold text-gray-400'>Add a place to this day from your list</h2>):
                selectedItems.map((item, index) => (
                    <div key={index} className="bg-gray-100 rounded-xl p-4 text-sm font-semibold flex-grow flex-col">
                        <div className='flex flex-row justify-between'>
                            {item.value}{' '}
                            <button onClick={()=>handleRemove(item, index)} className="font-semibold text-gray-400 self-end">Remove</button>
                        </div>
                   
                        <TextareaAutosize
                            className='resize-none bg-white outline-none mt-2 mb-2 font-normal p-2 text-gray-500 w-full rounded-lg max-h-58 h-auto flex-shrink-0'
                            placeholder='Add any notes here'
                            onChange={(e) => onTextAreaChange(index, e.target.value)}
                            value={notes[index]}

                        />
                        <input
                            className='mt-2 rounded-lg py-1 px-2 font-norma text-gray-500 outline-none font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                            type='number'
                            pattern="^-?[0-9]\d*\.?\d*$"
                            placeholder='TODO Cost'
                        />

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