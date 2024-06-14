import React from 'react'
import SignUp from '../../components/User/SignUp'
import SignIn from '../../components/User/SignIn'

const Authentication = ({children}) => {
  return (
    <div className='flex w-screen h-screen'>
      <div className='md:w-1/4 h-full bg-purple-950'>

      </div>
      <div className='sm:w-screen md:w-3/4 h-full flex justify-center items-center'>
        {children}
      </div>
    </div>
  )
}

export default Authentication
