import React from 'react'
import SignUp from '../../components/User/SignUp'
import SignIn from '../../components/User/SignIn'

const Authentication = ({children}) => {
  return (
    <div className='flex w-screen h-screen'>
      <div className='md:w-2/6 h-full bg-purple-950 flex flex-col justify-center bg-purple-900 items-center text-white'>
        <h1 className="text-5xl font-bold mb-4">Get Into</h1>
        <h1 className="text-7xl font-bold mb-4">DevHub</h1>
      </div>
      <div className='sm:w-full md:w-4/6 h-full flex justify-center items-center'>
        {children}
      </div>
    </div>

  )
}

export default Authentication
