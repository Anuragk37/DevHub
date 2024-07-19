// components/User/Profile/FollowersModal.js
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

const FollowersModal = ({ isOpen, onClose, userId, type }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, []);



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

  if (!isOpen) return null;

  const handleProfileClick = (userId) => () => {
    navigate(`/user/profile/${userId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{type === 'followers' ? 'Followers' : 'Following'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="py-3 flex items-center" onClick={handleProfileClick(user.id)}>
                  <img src={user.profile_pic} alt={user.username} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold">{user.fullname}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FollowersModal;
