import React, { useState, useEffect } from 'react';
import { FaEdit, FaMapMarkerAlt, FaLink, FaCalendarAlt, FaEnvelope, FaUserPlus, FaUserMinus, FaEllipsisV, FaFlag } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';
import EditProfileModal from './EditProfileModal';
import FollowersModal from './FollowersModal';
import ReportModal from './ReportModal';

const ProfileDetails = ({ isOwnProfile, userId, handleFollowUnfollow }) => {
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
    following: 0,
    isFollowing: false,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getUser = async () => {
    try {
      const response = await axiosInstance.get(`/account/user/${userId}/`);
      console.log(response.data);
      setUserData({
        name: response.data.fullname,
        username: response.data.username,
        email: response.data.email,
        bio: response.data.bio,
        location: response.data.location || '',
        profilePic: response.data.profile_pic,
        website: response.data.website || '',
        joinDate: response.data.date_joined || '',
        followers: response.data.followers_count || 0,
        following: response.data.following_count || 0,
        isFollowing: response.data.is_following,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    getUser();
  };

  const handleOpenFollowersModal = () => {
    setIsFollowersModalOpen(true);
  };

  const handleOpenFollowingModal = () => {
    setIsFollowingModalOpen(true);
  };

  const handleCloseFollowersModal = () => {
    setIsFollowersModalOpen(false);
  };

  const handleCloseFollowingModal = () => {
    setIsFollowingModalOpen(false);
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <div className="h-48 bg-gradient-to-r from-purple-600 to-indigo-600 relative">
        {isOwnProfile && (
          <button
            onClick={handleEditProfile}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FaEdit className="text-white text-xl" />
          </button>
        )}
      </div>
      <div className="relative px-6 py-8">
        <div className="flex items-start">
          <img
            className="h-32 w-32 rounded-full ring-4 ring-white bg-white object-cover shadow-lg -mt-20"
            src={userData.profilePic}
            alt={userData.name}
          />
          <div className="ml-auto flex space-x-2">
            {!isOwnProfile && (
              <>
                <button
                  onClick={() => handleFollowUnfollow(setUserData)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    userData.isFollowing
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {userData.isFollowing ? (
                    <>
                      <FaUserMinus className="inline mr-2" /> Unfollow
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="inline mr-2" /> Follow
                    </>
                  )}
                </button>
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="px-3 py-2 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300"
                  >
                    <FaEllipsisV />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <button
                        onClick={handleOpenReportModal}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaFlag className="inline mr-2" /> Report User
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
          <p className="text-lg font-medium text-gray-500">@{userData.username}</p>
          <p className="mt-2 text-gray-700">{userData.bio}</p>
          <div className="mt-4 flex flex-wrap text-sm text-gray-500 space-y-2">
            <span className="flex items-center mr-4">
              <FaEnvelope className="mr-2 text-gray-400" />
              {userData.email}
            </span>
            {userData.location && (
              <span className="flex items-center mr-4">
                <FaMapMarkerAlt className="mr-2 text-gray-400" />
                {userData.location}
              </span>
            )}
            {userData.website && (
              <span className="flex items-center mr-4">
                <FaLink className="mr-2 text-gray-400" />
                <a href={userData.website} className="text-purple-600 hover:text-purple-500 transition-colors duration-300">
                  {userData.website}
                </a>
              </span>
            )}
            <span className="flex items-center">
              <FaCalendarAlt className="mr-2 text-gray-400" />
              Joined {new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="mt-6 flex items-center space-x-8 text-sm">
            <div>
              <button onClick={handleOpenFollowersModal} className="focus:outline-none">
                <span className="font-medium text-gray-900 text-2xl">{userData.followers}</span>
                <span className="text-gray-500 ml-2">Followers</span>
              </button>
            </div>
            <div>
              <button onClick={handleOpenFollowingModal} className="focus:outline-none">
                <span className="font-medium text-gray-900 text-2xl">{userData.following}</span>
                <span className="text-gray-500 ml-2">Following</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <EditProfileModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} initialData={userData} />
      )}
      {isFollowersModalOpen && (
        <FollowersModal
          isOpen={isFollowersModalOpen}
          onClose={handleCloseFollowersModal}
          userId={userId}
          type="followers"
        />
      )}
      {isFollowingModalOpen && (
        <FollowersModal
          isOpen={isFollowingModalOpen}
          onClose={handleCloseFollowingModal}
          userId={userId}
          type="following"
        />
      )}
      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={handleCloseReportModal}
          userId={userId}
        />
      )}
    </div>
  );
};

export default ProfileDetails;