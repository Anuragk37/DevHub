import React, { useEffect, useState } from 'react';
import Header from '../../../components/User/Header';
import SideBar from '../../../components/User/SideBar';
import axiosInstance from '../../../utils/axiosInstance';
import TeamCard from '../../../components/Team/TeamCard';
import TeamInvitationCard from '../../../components/Team/TeamInvitationCard';
import { Link } from 'react-router-dom';

const MyTeam = () => {
  const [activeTab, setActiveTab] = useState("my-team");
  const [myTeams, setMyTeams] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getMyTeam = async () => {
    try {
      const userTeam = await axiosInstance.get('/team/user-team/');
      setMyTeams(userTeam.data);

      const allTeam = await axiosInstance.get('/team/user-joined-team/');
      setAllTeam(allTeam.data);
    } catch (error) {
      console.error(error);
    }
  }

  const getTeamInvitations = async () => {
    try {
      const response = await axiosInstance.get('/team/team-invitation/');
      setInvitations(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getMyTeam();
    getTeamInvitations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex pt-16 px-4 md:px-10 lg:px-16">
        <SideBar />
        <main className="flex-1 px-4 sm:px-6 lg:px-4 py-8 ">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-between border-b border-gray-200 mb-6">
              <div className="flex flex-wrap">
                {['my-team', 'joined-team', 'all-team'].map((tab) => (
                  <button
                    key={tab}
                    className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                      activeTab === tab
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab === 'my-team' ? 'My Teams' : tab === 'joined-team' ? 'Joined Teams' : 'All Teams'}
                  </button>
                ))}
              </div>
              <Link to="/user/create-team" className="mb-2">
                <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-3xl">
                  Create Team
                </button>
              </Link>
            </div>
            <div>
              {activeTab === 'my-team' && (
                <div className="space-y-4">
                  {myTeams.length > 0 ? (
                    myTeams.map((team) => (
                      <TeamCard key={team.id} team={team} fromMyTeam={true} />
                    ))
                  ) : (
                    <p className="text-gray-600">You haven't created any teams yet.</p>
                  )}
                </div>
              )}
              {activeTab === 'joined-team' && (
                <div className="space-y-4">
                  {allTeam.length > 0 ? (
                    allTeam.map((team) => (
                      <TeamCard key={team.id} team={team} fromMyTeam={false} />
                    ))
                  ) : (
                    <p className="text-gray-600">There are no teams available to join.</p>
                  )}
                </div>
              )}
              {activeTab === 'all-team' && (
                <div className="space-y-4">
                  {invitations.length > 0 ? (
                    invitations.map((invitation) => (
                      <TeamInvitationCard key={invitation.id} invitation={invitation} />
                    ))
                  ) : (
                    <p className="text-center text-gray-600">No team invitations at the moment.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyTeam;