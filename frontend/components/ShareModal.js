import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useRouter } from "next/router";
import FormInput from './FormInput'

export default function ShareModal({ isOpen, setIsOpen }) {
  const router = useRouter();
  const tripid = router.query.id;
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  
  function closeModal() {
    setIsOpen(false)
    setUsername('')
    setError('')
  }

  function openModal() {
    setIsOpen(true)
  }

  async function handleSubmit() {
    //send request to server with username
    console.log(tripid)
    console.log(username)
    let dev = process.env.NODE_ENV !== 'production';

		const url = `${dev ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL}/user/trip/add/${tripid}`
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        username: username
      }),
      headers: {
				'Content-Type': 'application/json',
			}
    })
    const data = await response.json()
    if (response.ok) {
      closeModal()
      setError('')
      setUsername('')
    } else {
      setError(data.message)
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-0"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-0"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Share this trip with your friends!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-md text-gray-500 text-left mb-4">
                      Add collaborators by specifying their username!
                    </p>
                  </div>

                  <input
                    className='w-full p-2 rounded-xl mb-2 appearance-none border-2 border-gray-200 !outline-none'
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value) }}
                    placeholder="Username"
                  />
                  {error && <p className='text-sm text-red-500'>{error}</p>}
                  <div className="mt-4 flex-row flex gap-x-2 place-content-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleSubmit}
                    >
                      Share
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Dismiss
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
