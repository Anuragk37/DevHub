// components/User/Profile/FollowersModal.js
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const FollowersModal = ({ isOpen, onClose, userId, type, isAuthenticated, setIsLoginModalOpen }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, userId, type]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = type === 'followers' 
        ? await axiosInstance.get(`/account/followers/${userId}`) 
        : await axiosInstance.get(`/account/following/${userId}`);
      setUsers(response.data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
    setLoading(false);
  };

  const handleProfileClick = (userId) => () => {
    navigate(`/user/profile/${userId}`);
    onClose();
  };

  const handleFollowUnfollow = async (followingId) => {

    try {
      await axiosInstance.post(`/account/follow-unfollow/`, {
        following_id: followingId,
      });
      setUsers(users.map(user => {
        if (user.id === followingId) {
          return { ...user, is_following: !user.is_following };
        }
        return user;
      }));
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{type === 'followers' ? 'Followers' : 'Following'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center cursor-pointer" onClick={handleProfileClick(user.id)}>
                  <img src={user.profile_pic} alt={user.username} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-lg">{user.fullname}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollowUnfollow(user.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    user.is_following
                      ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {user.is_following ? 'Unfollow' : 'Follow'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FollowersModal;