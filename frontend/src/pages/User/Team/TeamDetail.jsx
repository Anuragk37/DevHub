import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaUsers, FaUserClock, FaInfoCircle, FaComment } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';
import defaultPic from '../../../assets/default.jpg';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';

const MemberList = ({ members, isPending, onAccept, onReject }) => (
  <ul className="space-y-8">
    {members.map(member => (
      <li key={member.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
        <Link to={`/user/profile/${member.id}`} className="flex items-center">
          <img
            src={member.profile_pic || defaultPic}
            alt={member.fullname}
            className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-purple-200"
          />
          <span className="text-base font-medium text-gray-800">{member.fullname}</span>
        </Link>
        {isPending && (
          <div>
            <button
              onClick={() => onAccept(member.id)}
              className="bg-green-500 text-white px-3 py-1 rounded-md text-sm mr-2 hover:bg-green-600 transition duration-300"
            >
              Accept
            </button>
            <button
              onClick={() => onReject(member.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition duration-300"
            >
              Reject
            </button>
          </div>
        )}
      </li>
    ))}
  </ul>
);

const TeamDetails = () => {
  const location = useLocation();
  const { team } = location.state || {};
  const [members, setMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState(['About', 'Team Members']);
  const [isCreator, setIsCreator] = useState(false);

  const userAccessToken = useSelector(state => state.auth.userAccessToken);
  const decodedToken = jwtDecode(userAccessToken);

  useEffect(() => {
    if (team) {
      axiosInstance.get(`/team/team-member/${team.id}/`)
        .then(response => {
          setMembers(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });

      axiosInstance.get(`/team/pending-request/${team.id}/`)
        .then(response => {
          const pendingRequests = response.data;
          const pendingUsers = pendingRequests.map(request => request.user);
          setPendingMembers(pendingUsers);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [team]);

  useEffect(() => {
    if (decodedToken.user_id === team.creator.id) {
      setIsCreator(true);
      if (!tabs.includes('Pending Requests')) {
        setTabs([...tabs, 'Pending Requests']);
      }
    }
  }, [decodedToken.user_id, team.creator.id, tabs]);

  const handleAccept = async (memberId) => {
    try {
      await axiosInstance.post(`/team/accept-request/`, {
        team_id: team.id,
        user_id: memberId
      });
      // Update pendingMembers state to reflect changes
      setPendingMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error(error);
    }
    console.log(`Accepted member ${memberId}`);
  };

  const handleReject = async (memberId) => {
    try {
      await axiosInstance.post(`/team/reject-request/`, {
        team_id: team.id,
        user_id: memberId
      });
      // Update pendingMembers state to reflect changes
      setPendingMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (error) {
      console.error(error);
    }
    console.log(`Rejected member ${memberId}`);
  };

  if (!team) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-48 relative">
            <img
              src={team.profile_pic_url || defaultPic}
              alt={`${team.name} banner`}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <img
              src={team.profile_pic_url || defaultPic}
              alt={`${team.name} logo`}
              className="absolute -bottom-12 left-6 w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <div className="pt-16 pb-8 px-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900">{team.name}</h1>
              <Link to={`/user/chat/`} state={{ team }}>
              <button className="bg-purple-600 text-white px-5 py-2 rounded-full text-base flex items-center hover:bg-purple-700 transition duration-300">
                <FaComment className="mr-2" />
                Chat
              </button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                <FaUser className="mr-3 text-purple-600 text-xl" />
                <span><strong className="block text-gray-900">Leader</strong> {team.creator.fullname}</span>
              </div>
              <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                <FaCalendarAlt className="mr-3 text-purple-600 text-xl" />
                <span><strong className="block text-gray-900">Created</strong> {new Date(team.created_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                <FaUsers className="mr-3 text-purple-600 text-xl" />
                <span><strong className="block text-gray-900">Members</strong> {members.length}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)} className="bg-white rounded-xl shadow-lg p-6">
          <TabList className="flex border-b mb-6">
            {tabs.map((tabName, index) => (
              <Tab
                key={`${tabName}-${index}`}
                className={`px-6 py-3 text-base font-medium cursor-pointer transition duration-300 ${
                  activeTab === index
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tabName}
              </Tab>
            ))}
          </TabList>

          <TabPanel>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaInfoCircle className="mr-3 text-purple-600" />
              About the Team
            </h2>
            <p className="text-base text-gray-700 leading-relaxed">{team.description}</p>
          </TabPanel>

          <TabPanel>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUsers className="mr-3 text-purple-600" />
              Team Members
            </h2>
            <MemberList members={members} isPending={false} />
          </TabPanel>

          {isCreator && (
            <TabPanel>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaUsers className="mr-3 text-purple-600" />
                Pending Requests
              </h2>
              <MemberList members={pendingMembers} isPending={true} onAccept={handleAccept} onReject={handleReject} />
            </TabPanel>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default TeamDetails;
