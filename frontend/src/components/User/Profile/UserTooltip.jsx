import React from 'react';
import { FaUser } from 'react-icons/fa';

const UserTooltip = ({ user, children }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute z-10 w-64 p-4 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -left-1/2 mt-2">
        <div className="flex items-center mb-2">
          {user.profile_pic ? (
            <img src={user.profile_pic} alt={user.fullname} className="w-12 h-12 rounded-full mr-3" />
          ) : (
            <FaUser className="w-12 h-12 rounded-full mr-3 text-gray-400" />
          )}
          <div>
            <p className="font-bold text-gray-800">{user.fullname}</p>
            <p className="text-sm text-gray-600">@{user.username}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-2">{user.email}</p>
        <p className="text-sm text-gray-600">{user.bio || "No bio available"}</p>
      </div>
    </div>
  );
};

export default UserTooltip;