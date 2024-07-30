import React, { useEffect, useState } from 'react';
import { FaCalendar, FaUsers, FaHashtag, FaLink, FaInfoCircle, FaBook, FaComments, FaUserFriends } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axiosInstance from '../../../utils/axiosInstance';
import { Link } from 'react-router-dom';

const CommunityDetail = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    fetchCommunityData();
    fetchMembers();
  }, [id, navigate]);

  const fetchCommunityData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/community/${id}/`);
      setCommunity(response.data);
    } catch (error) {
      console.error('Error fetching community data:', error);
      navigate('/404');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axiosInstance.get(`/community/community-members/${id}`);
      console.log("members",response.data);
      const memberList = response.data.map(data => data.user);

      console.log("memberList",memberList);
      setMembers(memberList);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleJoinCommunity = async () => {
    if (isJoining || community.is_member) return;

    setIsJoining(true);
    try {
      await axiosInstance.post('/community/join-community/', {
        community_id: community.id
      });
      
      setCommunity(prevCommunity => ({
        ...prevCommunity,
        is_member: true,
        member_count: prevCommunity.member_count + 1
      }));
    } catch (error) {
      console.error('Error joining community:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveCommunity = async () => {
    if (isLeaving || !community.is_member) return;

    setIsLeaving(true);
    try {
      await axiosInstance.post('/community/leave-community/', {
        community_id: community.id
      });
      
      setCommunity(prevCommunity => ({
        ...prevCommunity,
        is_member: false,
        member_count: prevCommunity.member_count - 1
      }));
    } catch (error) {
      console.error('Error leaving community:', error);
    } finally {
      setIsLeaving(false);
    }
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (!community) return null;

  return (
    <div className="min-h-screen bg-purple-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-48 relative">
            <img src={community.banner_url || "/default-banner.jpg"} alt="Community Banner" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <img
              src={community.profile_pic_url || "/default-profile.jpg"}
              alt={`${community.name} logo`}
              className="absolute -bottom-12 left-6 w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <div className="pt-16 pb-8 px-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900">{community.name}</h1>
              {community.is_member ? (
                <div className="flex space-x-4">
                  <Link to={`/community/chat`} state={{ community }}>
                  <button className="bg-purple-600 text-white px-5 py-2 rounded-full text-base flex items-center hover:bg-purple-700 transition duration-300">
                    Chat
                  </button>
                  </Link>
                  <button 
                    className={`bg-red-600 text-white px-5 py-2 rounded-full text-base flex items-center hover:bg-red-700 transition duration-300 ${isLeaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleLeaveCommunity}
                    disabled={isLeaving}
                  >
                    {isLeaving ? 'Leaving...' : 'Leave Community'}
                  </button>
                </div>
              ) : (
                <button 
                  className={`bg-purple-600 text-white px-5 py-2 rounded-full text-base flex items-center hover:bg-purple-700 transition duration-300 ${isJoining ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleJoinCommunity}
                  disabled={isJoining}
                >
                  {isJoining ? 'Joining...' : 'Join Community'}
                </button>
              )}
            </div>
            <p className="text-gray-600 mt-2 text-lg">{community.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 text-sm text-gray-600">
              <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                <FaUsers className="mr-3 text-purple-600 text-xl" />
                <span><strong className="block text-gray-900">Members</strong> {community.member_count || 0}</span>
              </div>
              <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                <FaCalendar className="mr-3 text-purple-600 text-xl" />
                <span><strong className="block text-gray-900">Created</strong> {new Date(community.created_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center bg-purple-50 p-3 rounded-lg">
                <FaHashtag className="mr-3 text-purple-600 text-xl" />
                <span><strong className="block text-gray-900">Category</strong> {community.category || 'Uncategorized'}</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)} className="bg-white rounded-xl shadow-lg p-6">
          <TabList className="flex flex-wrap border-b mb-6">
            {['About', 'Rules', 'Discussions', 'Members'].map((tabName, index) => (
              <Tab
                key={tabName}
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
              About {community.name}
            </h2>
            <p className="text-base text-gray-700 leading-relaxed mb-6">{community.long_description || community.description}</p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Quick Info</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FaUsers className="mr-2 text-purple-600" />
                  <span><strong>{community.member_count || 0}</strong> active members</span>
                </li>
                <li className="flex items-center">
                  <FaCalendar className="mr-2 text-purple-600" />
                  <span>Founded on <strong>{new Date(community.created_date).toLocaleDateString()}</strong></span>
                </li>
                {community.website && (
                  <li className="flex items-center">
                    <FaLink className="mr-2 text-purple-600" />
                    <a href={community.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{community.website}</a>
                  </li>
                )}
              </ul>
            </div>
          </TabPanel>

          <TabPanel>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBook className="mr-3 text-purple-600" />
              Community Guidelines
            </h2>
            <div className="space-y-4">
              {community.rules && community.rules.split('\n').map((rule, index) => (
                <div key={index} className="flex items-start bg-purple-50 p-4 rounded-lg">
                  <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{rule}</p>
                </div>
              ))}
            </div>
          </TabPanel>

          <TabPanel>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaComments className="mr-3 text-purple-600" />
              Recent Discussions
            </h2>
            <p className="text-gray-600">Discussion forum content would go here.</p>
          </TabPanel>

          <TabPanel>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaUserFriends className="mr-3 text-purple-600" />
              Community Members
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {members.map((member) => (
                <div key={member.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3">
                  <img 
                    src={member.profile_pic || "/default-avatar.jpg"} 
                    alt={member.username} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="overflow-hidden">
                    <p className="font-medium text-gray-900 truncate">{member.username}</p>
                    <p className="text-xs text-gray-500 truncate">@{member.username.toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityDetail;