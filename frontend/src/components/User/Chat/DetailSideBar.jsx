// Sidebar.js
import React from 'react';
import { FaSearch, FaUsers } from 'react-icons/fa';

const DetailSideBar = ({team, members, isSidebarOpen, toggleSidebar, searchQuery, setSearchQuery }) => {
   console.log("memberssssssssssssssssssssssssssssssss", members);
  return (
    <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-1/4 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col`}>
      <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <h2 className="text-2xl font-bold">{team.name}</h2>
        <p className="text-sm opacity-75 mt-1">Team/Community Collaboration Hub</p>
      </div>
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-150 ease-in-out"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-lg font-semibold p-4 flex items-center text-gray-700"><FaUsers className="mr-2 text-purple-500" /> Members</h3>
        <ul className="px-2">
          {members.map((member) => (
            <li key={member.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition duration-150 ease-in-out">
              <div className="relative">
                <img src={member.profile_pic} alt={member.name} className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200" />
              </div>
              <span className="font-medium text-gray-800">{member.fullname}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetailSideBar;
