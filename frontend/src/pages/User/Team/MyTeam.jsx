import React, { useEffect, useState } from 'react';
import Header from '../../../components/User/Header';
import SideBar from '../../../components/User/SideBar';
import axiosInstance from '../../../utils/axiosInstance';
import TeamCard from '../../../components/Team/TeamCard';

const MyTeam = () => {
  const [activeTab, setActiveTab] = useState("my-team");
  const [myTeams, setMyTeams] = useState([]);
  const [allTeam, setAllTeam] = useState([]);

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

  useEffect(() => {
    getMyTeam();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-col lg:flex-row w-full px-6 mt-16 lg:px-20 py-6">
        <div className="hidden md:block md:w-1/5 mr-6">
          <SideBar />
        </div>
        <div className="w-full md:w-4/5 lg:w-4/5 lg:px-4">
          <h2 className="text-3xl font-bold text-purple-700 mb-6">My Teams</h2>
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === 'my-team'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabClick('my-team')}
            >
              My Teams
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === 'all-team'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabClick('all-team')}
            >
              All Teams
            </button>
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
            {activeTab === 'all-team' && (
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyTeam;