import React from 'react'

function ProgressBar(props) {
    const { current, max } = props;

    const progress = (current / max) * 100

    const percent = progress >= 100 ? 100 : progress

  return (
    <div className='bg-gray-200 h-1 rounded'>
        <div
            className='bg-blue-500 h-full rounded'
            style={{ width: `${percent}%` }}
        >
        </div>
    </div>
  )
}

export default ProgressBar