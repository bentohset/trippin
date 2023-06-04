import React, { useState, useEffect } from "react";
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'


function SmallCard({ id, img, location, startDate, endDate, year, title }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath, undefined,  { scroll: false });
  }

  const handleDelete = async () => {
    let dev = process.env.NODE_ENV !== 'production';

    const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/trips/${id}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      } 
    })

    console.log(response)
    const data = await response.json()
    .then(data => {
      if (response.status === 200) {
        console.log("successfully deleted")
        handleClose()
        refreshData()
      } else {
        console.log(data.message)
      }
    })
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className='relative flex flex-row items-center justify-between'>
      <div className="flex w-full flex-row relative justify-between items-center m-2 mt-5 rounded-xl cursor-pointer
       hover:rounded-xl hover:scale-105 transition-transform duration-200 ease-out">
        <Link href={`/plan/${id}`} className='rounded-xl flex-1'>
          <div className='flex flex-row items-center w-full'>
            <div className='relative h-20 w-20 ml-2'>
              <Image src={img} alt="" fill className="rounded-lg"/>
            </div>
            
            <div className='flex flex-col mx-2'>
              <h2 className=''>{title}</h2>
              <h3 className='text-gray-500'>{startDate} - {endDate}</h3>
              <h4 className='text-gray-400'>{year}</h4>
            </div>
          </div>
          <div>

          </div>
        </Link>
        
          <button className='z-40 absolute right-0' onClick={()=>{handleOpen()}}>
            <div className='bg-gray-300 rounded-full flex p-1 items-center justify-center hover:bg-gray-400'>
                <XMarkIcon
                  className='h-4 text-gray-600 font-bold'
                />
            </div>
          </button>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            font: 'unset',
          }}
        >
          <DialogTitle
            sx={{
              font: 'unset',
            }}
            style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: 'large'
            }}
          >
            {"Delete"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              sx={{
                font: 'unset',
              }}
              style={{
                color: 'black',
                fontSize: 'medium'
              }}
            >
              Are you sure you want to delete this plan? This is irreversible
            </DialogContentText>
          </DialogContent>
          <DialogActions
          >
            <Button onClick={handleClose}
              sx={{
                backgroundColor: 'grey',
                color: 'grey',
                '&:hover':{
                  backgroundColor: 'darkred'
                },
                textTransform: 'none'
              }}
              style={{
                color: 'black', backgroundColor: 'lightgrey',
              }}
            >
              Don't delete
            </Button>
            <Button onClick={()=>{handleDelete()}} autoFocus
              sx={{
                backgroundColor: 'rgb(248, 113, 113)',
                color: 'black',
                '&:hover':{
                  backgroundColor: 'darkred'
                },
                textTransform: 'none',
                
                fontWeight: 'bold'
              }}
              style={{
                color: 'white', backgroundColor: 'rgb(255, 113, 113)',
                
              }}
            >
              Yes, delete
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  )
}

export default SmallCard