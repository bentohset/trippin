import React, { useState, useEffect } from "react";
import { XMarkIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

function ProfileTripCard({ index, length, id, startDate, endDate, year, title, handleDeleteTrip }) {
  const [open, setOpen] = useState(false)

  const convertDate = (date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.slice(8,10) //8 and 9
    const monthIndex = parseInt(date.slice(5,7)); //5 and 6
    const year = date.slice(0,4)//0-3 index
    const month = monthNames[monthIndex-1];
    return `${day} ${month}`
	}
	const getYear = (date) => {
		const year = date.slice(0,4)//0-3 index
		return year
	}

  const handleDelete = () => {
    handleDeleteTrip(id)
    handleClose()
  }

  const handleOpen = () => {
    setOpen(true)
  }
  
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className='relative flex flex-row items-center justify-between h-full w-full'>
      <div className={`bg-white flex w-full flex-row relative justify-between items-center cursor-pointer
        hover:bg-gray-200 transition-transform duration-200 ease-out ${index===length-1 ? `rounded-b-xl hover:rounded-b-xl`: ``} ${index===0 ? `rounded-t-xl hover:rounded-t-xl border-b-2`: ``}`}>
        <Link href={`/plan/${id}`} className='rounded-xl flex-1'>
          <div className='flex flex-row items-center w-full p-2'>
            {startDate && 
            <div className='flex flex-col mx-2'>
                <h2 className=''>{title}</h2>
                
                <h3 className='text-gray-500'>{convertDate(startDate)} - {convertDate(endDate)}</h3>
                <h4 className='text-gray-400'>{getYear(year)}</h4>
              
            </div>
            }
          </div>
          <div>

          </div>
        </Link>
        
          <button className='z-40 absolute right-1 top-1' onClick={()=>{handleOpen()}}>
            <div className='bg-gray-300 rounded-lg flex p-1 items-center justify-center hover:bg-gray-400'>
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

export default ProfileTripCard