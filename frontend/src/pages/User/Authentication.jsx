import React from 'react'

const Authentication = ({children}) => {
  return (
    <div className='flex w-screen h-screen'>
      <div className='hidden md:flex md:w-2/6 h-full bg-purple-950 flex-col justify-center items-center text-white'>
        <h1 className="text-5xl font-bold mb-4">Get Into</h1>
        <h1 className="text-7xl font-bold mb-4">DevHub</h1>
      </div>
      <div className='w-full px-4 md:w-4/6 h-full flex flex-col justify-center items-center'>
        {children}
      </div>
    </div>
  )
}

export default Authentication