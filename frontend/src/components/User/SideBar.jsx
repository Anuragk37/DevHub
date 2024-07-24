import React, { useState } from 'react';
import { FaUsers, FaSearch, FaPlus, FaUserPlus, FaUsersCog, FaUserFriends, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed z-50">
      <button
        className="md:hidden p-4 text-purple-950"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
      </button>
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } md:block h-[85vh] w-72 bg-white text-purple-950 shadow-xl rounded-xl p-6 flex flex-col justify-between transition-transform transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative fixed`}
      >
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Community</h2>

            <button className="flex items-center w-full py-3 px-4 mb-2 font-semibold bg-purple-300 hover:bg-purple-800 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
              <FaUsers className="mr-3" />
              <span>Your communities</span>
            </button>

            <Link to={'/user/view-communities/'}>
              <button className="flex items-center w-full py-3 px-4 mb-2 font-semibold bg-purple-300 hover:bg-purple-800 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
                <FaSearch className="mr-3" />
                <span>Find</span>
              </button>
            </Link>
            <Link to={'/user/create-community'}>
              <button className="flex items-center w-full py-3 px-4 mb-2 font-semibold bg-purple-300 hover:bg-purple-800 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
                <FaPlus className="mr-3" />
                <span>Create</span>
              </button>
            </Link>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Teams</h2>
            <Link to={'/user/create-team'}>
              <button className="flex items-center w-full py-3 px-4 mb-2 font-semibold bg-purple-300 hover:bg-purple-800 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
                <FaUserPlus className="mr-3" />
                <span>Create team</span>
              </button>
            </Link>
            <Link to={'/user/my-team'}>
            <button className="flex items-center w-full py-3 px-4 mb-2 font-semibold bg-purple-300 hover:bg-purple-800 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
              <FaUsersCog className="mr-3" />
              <span>My teams</span>
            </button>
            </Link>
            <Link to={'/user/team-invitations'}>
              <button className="flex items-center w-full py-3 px-4 mb-2 font-semibold bg-purple-300 hover:bg-purple-800 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
                <FaUserFriends className="mr-3" />
                <span>Join teams</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
