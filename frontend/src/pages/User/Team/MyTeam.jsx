import React, { useEffect, useState } from 'react';
import Header from '../../../components/User/Header';
import SideBar from '../../../components/User/SideBar';
import axiosInstance from '../../../utils/axiosInstance';
import TeamCard from '../../../components/Team/TeamCard';

const MyTeam = () => {
  const [activeTab, setActiveTab] = useState("my-team");
  const [myTeams, setMyTeams] = useState([]);
  const [allTeam , setAllTeam] = useState([]);

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
    if (activeTab === "my-team") {
      getMyTeam();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <Header />
      <div className="flex flex-col lg:flex-row w-full px-6 mt-16 lg:px-20 py-6">
        <div className="hidden md:block md:w-1/5 mr-6">
          <SideBar />
        </div>
        <div className="w-full md:w-4/5 lg:w-4/5 lg:px-4">
          <nav className='flex mb-4 border-b border-gray-200'>
            <button
              className={`mr-4 py-2 px-6 ${activeTab === 'my-team' ? 'font-bold bg-purple-800 text-white' : ''}`}
              onClick={() => handleTabClick('my-team')}
            >
              My Teams
            </button>
            <button
              className={`mr-4 py-2 px-6 ${activeTab === 'all-team' ? 'font-bold bg-purple-800 text-white' : ''}`}
              onClick={() => handleTabClick('all-team')}
            >
              All Team
            </button>
          </nav>
          <div>
            {activeTab === 'my-team' && myTeams.length > 0 && (
              <div className="">
                {myTeams.map((team) => (
                  <TeamCard key={team.id} team={team} fromMyTeam = {true} />
                ))}
              </div>
            )}
          </div>
          {activeTab === 'all-team' && allTeam.length > 0 && (
            <div>
              {allTeam.map((team) => (
                <TeamCard key={team.id} team={team} fromMyTeam = {false}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyTeam;
