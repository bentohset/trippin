import React from 'react'
import { FaGithub, FaHeart } from 'react-icons/fa'

function Footer() {
  return (
    <div className='flex justify-center items-center py-8 bg-gray-100 text-gray-700'>
      <a href='https://github.com/bentohset' target='_blank'>
      <div className='flex justify-center items-center flex-row'>
        <FaGithub size="1.5em"/>
        <div className='ml-2 flex flex-row justify-center items-center gap-1.5 flex-nowrap'>
          <p>Made with</p>
          <FaHeart size='0.7em' color='#FD5B61'/>
          <p>by bentohset</p>
        </div>
      </div>
      </a>
    </div>
  )
}

export default Footer
