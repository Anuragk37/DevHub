import React from 'react';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TeamCard = ({ team }) => {
  const navigate = useNavigate();
  
  const handleViewTeam = () => {
    navigate('/user/team-detail/', { state: { team } });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col md:flex-row items-center hover:shadow-lg transition-shadow duration-300">
      <img 
        src={team.profile_pic_url} 
        alt={`${team.name} logo`}
        className="w-20 h-20 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
      />
      <div className="flex-grow text-center md:text-left">
        <h3 className="text-xl font-semibold text-purple-900 mb-2">{team.name}</h3>
        <p className="text-md text-gray-700 mb-1">Created by: <span className="font-medium text-purple-700">{team.creator.username}</span></p>
        <p className="text-sm text-gray-500">Invited on: {new Date(team.created_date).toLocaleDateString()}</p>
      </div>
      <button 
        className="bg-purple-600 text-white px-5 py-2 mt-4 md:mt-0 rounded-full hover:bg-purple-700 transition duration-300 flex items-center"
        onClick={handleViewTeam}
      >
        <FaEye className="mr-2" />
        View
      </button>
    </div>
  );
};

export default TeamCard;
