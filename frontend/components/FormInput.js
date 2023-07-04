import React from 'react'

function FormInput({ placeholder, label, onChange, value, id, type}) {
  return (
    <div>
        <label htmlFor={id} className='text-sm block text-gray-700'>{label}</label>
        <input
            className='w-full p-2 rounded-xl mb-2 appearance-none border-2 border-gray-200 !outline-none'
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    </div>
  )
}

export default FormInput