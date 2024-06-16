import React from 'react'
import SideBar from '../../components/Admin/SideBar'
import Header from '../../components/Admin/Header'

const AdminHome = () => {
  return (
    <div className='w-screen min-h-screen max-h-full bg-gray-100'>
      <Header />
      <SideBar />
    </div>
  )
}

export default AdminHome
