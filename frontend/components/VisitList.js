import React, { useState } from 'react'

function VisitList({ list, onListUpdate }) {
    const [place, setPlace] = useState('');

    function handleAdd() {
        const updatedList = [...list, place];
        onListUpdate(updatedList);
        setPlace('');
    }

    function handleRemove(place) {
        const updatedList = list.filter(i => i !== place);
        onListUpdate(updatedList);
    }

  return (
    <div className='flex-1 my-4 mt-2'>
        <ul className='space-y-4 font-bold'>
            {list.map((place, index) => (
                <li 
                    key={index}
                    className="rounded-xl p-4 outline-none bg-gray-100 flex flex-row justify-between"
                >
                    {place}{' '}
                    <button onClick={()=>handleRemove(place)} className="font-semibold text-gray-400 self-end hover:text-gray-600">Remove</button>
                </li>
            ))}
        </ul>
        <div className='flex justify-between items-center'>
            <input
                type="text"
                onChange={(e)=>{setPlace(e.target.value)}}
                value={place}
                placeholder='Add a location'
                className="w-11/12 my-4 rounded-xl p-4 outline-none bg-gray-100"
                required
            />
            <button onClick={handleAdd} disabled={!place} className={`ml-2 bg-gray-100 rounded-xl p-4 px-6 text-gray-500 ${!place ? ``:`hover:bg-gray-200`} `}>+</button>
        </div>
    </div>
  )
}

export default VisitList