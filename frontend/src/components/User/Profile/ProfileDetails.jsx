import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import {jwtDecode} from 'jwt-decode'
import BaseUrl from '../../../utils/BaseUrls'
import {AddBio} from './AddBio'

const ProfileDetails = () => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [isBioModalOpen, setIsBioModalOpen] = useState(false)

  const accessToken = useSelector((state) => state.auth.userAccessToken)

  const getUser = async () => {
    const decodedToken = jwtDecode(accessToken)
    const userId = decodedToken.user_id
    const response = await axios.get(`${BaseUrl}/account/user/${userId}/`)
    setBio(response.data.bio)
    setName(response.data.fullname)
    setUsername(response.data.username)
  }

  useEffect(() => {
    getUser()
  }, [isBioModalOpen])

  const handleBioClick = () => {
    setIsBioModalOpen(true)
  }

  const handleCloseModal = () => {
   console.log("clicked")
    setIsBioModalOpen(false)
  }

  return (
    <div className='h-full sm:full md:w-1/4 lg:w-4/12 shadow-equel rounded-xl'>
      <div className='bio w-full flex-col p-6'>
        <div className="profile-pic w-1/4 rounded-full overflow-hidden">
          <img src="https://www.cornwallbusinessawards.co.uk/wp-content/uploads/2017/11/dummy450x450.jpg" alt="Profile Picture" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2 ml-8">{name}</h2>
          <p className="text-gray-600 mb-3">@{username}</p>
          {bio ? (
            <p className="text-gray-600">{bio}</p>
          ) : (
            <p className="text-gray-600 cursor-pointer" onClick={handleBioClick}>Add Bio</p>
          )}
          <div className='flex mt-3'>
            <p>30k followers</p>
            <p className='ml-4'>100 following</p>
          </div>
        </div>
      </div>
      {isBioModalOpen && <AddBio onClose={handleCloseModal} positionClass="left-0" />}
    </div>
  )
}

export default ProfileDetails
