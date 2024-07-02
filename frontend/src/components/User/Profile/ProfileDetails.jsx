import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import BaseUrl from '../../../utils/BaseUrls';
import EditProfileModal from './EditProfileModal';
import { FaEdit } from 'react-icons/fa';

const ProfileDetails = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const accessToken = useSelector((state) => state.auth.userAccessToken);

  const getUser = async () => {
    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken.user_id;
    
    try {
      const response = await axios.get(`${BaseUrl}/account/user/${userId}/`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
      setBio(response.data.bio);
      setName(response.data.fullname);
      setUsername(response.data.username);
      setProfilePic(`http://127.0.0.1:8000${response.data.profile_pic}`) 
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    getUser()
  };

  return (
    <div className='h-full sm:full md:w-1/4 lg:w-4/12 shadow-equel rounded-xl p-2'>
      <div className='bio w-full flex-col p-6'>
        <div className="flex items-center justify-end">
          <FaEdit className='text-xl text-purple-950 cursor-pointer' onClick={handleEditProfile} />
        </div>
        <div className="profile-pic w-1/4 rounded-full overflow-hidden">
          <img src={profilePic} alt="Profile Picture" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2 ml-8">{name}</h2>
          <p className="text-gray-600 mb-3">@{username}</p>
          {bio ? (
            <p className="text-gray-600">{bio}</p>
          ) : (
            <p className="text-gray-600 cursor-pointer" onClick={handleEditProfile}>Add Bio</p>
          )}
          <div className='flex mt-3'>
            <p>30k followers</p>
            <p className='ml-4'>100 following</p>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          initialData={{ name, username, bio }}
        />
      )}
    </div>
  );
};

export default ProfileDetails;
