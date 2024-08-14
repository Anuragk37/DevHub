import React from 'react';
import { FaUserPlus } from 'react-icons/fa';

const RightSidebar = () => {
  const recommendedUsers = [
    { id: 1, name: 'John Doe', avatar: '/path/to/john.jpg', role: 'Frontend Developer' },
    { id: 2, name: 'Jane Smith', avatar: '/path/to/jane.jpg', role: 'UX Designer' },
    { id: 3, name: 'Mike Johnson', avatar: '/path/to/mike.jpg', role: 'Backend Engineer' },
  ];

  return (
    <div className="h-[85vh] w-72 bg-white text-purple-950 shadow-xl rounded-xl p-6 flex flex-col space-y-6 overflow-y-auto">
      <h2 className="text-xl font-bold text-purple-800">Recommended to Follow</h2>
      <div className="space-y-4">
        {recommendedUsers.map((user) => (
          <div key={user.id} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.role}</p>
            </div>
            <button className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200">
              <FaUserPlus />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-purple-100 rounded-lg">
        <h3 className="font-semibold text-purple-800 mb-2">Pro Tip</h3>
        <p className="text-sm text-purple-700">Engage with the community by following experts in your field!</p>
      </div>
    </div>
  );
};

export default RightSidebar;