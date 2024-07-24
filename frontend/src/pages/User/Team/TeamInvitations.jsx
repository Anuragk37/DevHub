import React, { useState, useEffect } from 'react';
import Header from '../../../components/User/Header';
import SideBar from '../../../components/User/SideBar';
import TeamInvitationCard from '../../../components/Team/TeamInvitationCard';
import axiosInstance from '../../../utils/axiosInstance';

const TeamInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await axiosInstance.get('/team/team-invitation/');
        console.log(response.data);
        setInvitations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team invitations:', error);
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <Header />
      <div className="flex flex-col lg:flex-row w-full px-6 mt-16 lg:px-20 py-6">
        <div className="hidden md:block md:w-1/5 mr-6">
          <SideBar />
        </div>
        <div className="w-full md:w-4/5 lg:w-3/5 lg:px-4">
          <h2 className="text-2xl font-bold text-purple-800 mb-6">Team Invitations</h2>
          {loading ? (
            <p className="text-center text-gray-600">Loading invitations...</p>
          ) : invitations.length > 0 ? (
            invitations.map((invitation) => (
              <TeamInvitationCard key={invitation.id} invitation={invitation} />
            ))
          ) : (
            <p className="text-center text-gray-600">No team invitations at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamInvitations;