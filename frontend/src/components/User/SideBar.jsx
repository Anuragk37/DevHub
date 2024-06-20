import React from 'react';
import { FaUsers, FaSearch, FaPlus, FaUserPlus, FaUsersCog, FaUserFriends } from 'react-icons/fa';

const SideBar = () => {
  return (
    <div className="h-[85vh] w-72 bg-white text-purple-950 shadow-xl rounded-xl p-6 flex flex-col justify-between fixed">
      <div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Community</h2>
          <button className="flex items-center w-full py-3 px-4 mb-2 font-semibold bg-purple-300 hover:bg-purple-800 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
            <FaUsers className="mr-3" />
            <span>Your communities</span>
          </button>
          <button className="flex items-center w-full py-3 px-4 mb-2 font-semibold bg-purple-300 hover:bg-purple-800 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
            <FaSearch className="mr-3" />
            <span>Find</span>
          </button>
          <button className="flex items-center w-full py-3 px-4 mb-2 font-semibold bg-purple-300 hover:bg-purple-800 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
            <FaPlus className="mr-3" />
            <span>Create</span>
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Teams</h2>
          <button className="flex items-center w-full py-3 px-4 mb-2 font-semibold bg-purple-300 hover:bg-purple-800 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
            <FaUserPlus className="mr-3" />
            <span>Create team</span>
          </button>
          <button className="flex items-center w-full py-3 px-4 mb-2 font-semibold bg-purple-300 hover:bg-purple-800 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
            <FaUsersCog className="mr-3" />
            <span>My teams</span>
          </button>
          <button className="flex items-center w-full py-3 px-4 mb-2 font-semibold bg-purple-300 hover:bg-purple-800 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
            <FaUserFriends className="mr-3" />
            <span>Join teams</span>
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default SideBar;
