// components/User/TeamInvitationCard.js
import React from 'react';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TeamInvitationCard = ({ invitation }) => {

   const navigate = useNavigate();
   console.log("invitationsssssssssssssssssssssssssssssss");
  const handleViewTeam = () => {
   const team = { ...invitation.team };
    navigate('/user/team-invitation-detail/',{ state: { team }});
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center">
      <img 
        src={invitation.team.profile_pic_url} 
        alt={`${invitation.teamName} logo`}
        className="w-16 h-16 rounded-full object-cover mr-4"
      />
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-purple-700">{invitation.team.name}</h3>
        <p className="text-sm text-gray-600">Created by: {invitation.team.creator.username}</p>
        <p className="text-xs text-gray-500">Invited on: {new Date(invitation.team.created_date).toLocaleDateString()}</p>
      </div>
      <button 
        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center"
        onClick={handleViewTeam}
      >
        <FaEye className="mr-2" />
        View
      </button>
    </div>
  );
};

export default TeamInvitationCard;