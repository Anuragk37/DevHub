import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import BaseUrl from '../../../utils/BaseUrls';
import EditProfileModal from './EditProfileModal';
import { FaEdit, FaMapMarkerAlt, FaLink, FaCalendarAlt, FaEnvelope } from 'react-icons/fa';

const ProfileDetails = () => {
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    location: '',
    profilePic: '',
    website: '',
    joinDate: '',
    followers: 0,
    following: 0
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const accessToken = useSelector((state) => state.auth.userAccessToken);

  const getUser = async () => {
    const decodedToken = jwtDecode(accessToken);
    const userId = decodedToken.user_id;
    
    try {
      const response = await axios.get(`${BaseUrl}/account/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserData({
        name: response.data.fullname,
        username: response.data.username,
        email: response.data.email,
        bio: response.data.bio,
        location: response.data.location || '',
        profilePic: `http://127.0.0.1:8000${response.data.profile_pic}`,
        website: response.data.website || '',
        joinDate: response.data.date_joined || '',
        followers: response.data.followers_count || 0,
        following: response.data.following_count || 0
      });
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
    getUser();
  };

  return (
    <div className="relative bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-purple-600 to-indigo-600 relative">
        <button
          onClick={handleEditProfile}
          className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300"
        >
          <FaEdit className="text-white text-xl" />
        </button>
      </div>
      <div className="relative px-4 sm:px-6 pb-8">
        <div className="flex flex-col items-center -mt-20">
          <img
            className="h-40 w-40 rounded-full ring-4 ring-white bg-white object-cover"
            src={userData.profilePic}
            alt={userData.name}
          />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">{userData.name}</h1>
          <p className="text-lg font-medium text-gray-500">@{userData.username}</p>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-700 max-w-2xl mx-auto">{userData.bio}</p>
        </div>
        <div className="mt-6 flex flex-wrap justify-center items-center text-sm text-gray-500 space-x-4">
          <span className="flex items-center mb-2">
            <FaEnvelope className="mr-2 text-gray-400" />
            {userData.email}
          </span>
          {userData.location && (
            <span className="flex items-center mb-2">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              {userData.location}
            </span>
          )}
          {userData.website && (
            <span className="flex items-center mb-2">
              <FaLink className="mr-2 text-gray-400" />
              <a href={userData.website} className="text-purple-600 hover:text-purple-500">{userData.website}</a>
            </span>
          )}
          <span className="flex items-center mb-2">
            <FaCalendarAlt className="mr-2 text-gray-400" />
            Joined {new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="mt-6 flex items-center justify-center space-x-8 text-sm">
          <div>
            <span className="font-medium text-gray-900 block text-center text-2xl">{userData.followers}</span>
            <span className="text-gray-500">Followers</span>
          </div>
          <div>
            <span className="font-medium text-gray-900 block text-center text-2xl">{userData.following}</span>
            <span className="text-gray-500">Following</span>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          initialData={userData}
        />
      )}
    </div>
  );
};

export default ProfileDetails;