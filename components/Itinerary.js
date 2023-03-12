import React, { useState } from 'react';

function Itinerary({ list }) {
    const [selectedItems, setSelectedItems] = useState([]);
    
    const handleItemSelect = (event) => {
        const value = event.target.value;
        if (selectedItems.includes(value)) {
            setSelectedItems(selectedItems.filter(item => item !== value));
        } else {
            setSelectedItems([...selectedItems, value]);
        }
    }

    const handleRemove = (item) => {
        setSelectedItems(selectedItems.filter(i => i !== item));
    }
    

  return (
    <div className='flex-1 w-full mt-4'>
        <div className='flex-1 space-y-4'>
            {(selectedItems.length === 0) ? (<h2 className='font-bold text-gray-400'>Add a place to this day</h2>):
                selectedItems.map((item, index) => (
                    <div key={index} className="bg-gray-100 rounded-xl p-4 text-sm font-semibold">
                        {item}{' '}
                        <button onClick={()=>handleRemove(item)} className="font-semibold text-gray-400 self-end">Remove</button>
                    </div>
                ))
            }
            
        </div>

        
        <select 
            multiple={true} 
            value={selectedItems} 
            onChange={handleItemSelect} 
            className="my-4 w-full appearance-none rounded-lg py-2 px-4 bg-gray-100 text-gray-700"
        >
            <option value="" disabled className='font-bold'>Choose places</option>
            {list.map((item, index) => (
                <option key={index} value={item}>{item}</option>
            ))}
        </select>
    </div>
  )
}

export default Itinerary