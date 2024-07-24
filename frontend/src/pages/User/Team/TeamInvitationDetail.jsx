import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../../../components/User/Header';
import SideBar from '../../../components/User/SideBar';
import axiosInstance from '../../../utils/axiosInstance';
import { FaUsers, FaCalendarAlt, FaUserTie, FaTags, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const TeamInvitationDetail = () => {
  const location = useLocation();
  const [isInterested, setIsInterested] = useState(false);
  const [interestStatus, setInterestStatus] = useState('');
  const { team } = location.state || {};

  useEffect(() => {
    const getInterest = async () => {
      try {
        const response = await axiosInstance.get(`/team/team-interest/${team.id}`);
        if (response.status === 200) {
          setInterestStatus(response.data[0].status);
          setIsInterested(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getInterest();
  }, [team.id]);

  const handleInterest = async () => {
    try {
      await axiosInstance.post(`/team/team-interest/`, { team_id: team.id });
      setIsInterested(true);
      setInterestStatus('Pending');
    } catch (error) {
      console.error('Error expressing interest:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <Header />
      <div className="flex flex-col lg:flex-row w-full px-6 mt-16 lg:px-20 py-6">
        <div className="hidden md:block md:w-1/5 mr-6">
          <SideBar />
        </div>
        <div className="w-full md:w-4/5 lg:w-4/5 lg:px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <img 
                src={team.profile_pic} 
                alt={team.name}
                className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-8 border-4 border-purple-300 shadow-md"
              />
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-purple-800 mb-2">{team.name}</h1>
                <p className="text-gray-600 text-lg">Created by <span className="font-semibold text-purple-600">{team.creator.fullname}</span></p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-700 mb-3">About the Team</h2>
              <p className="text-gray-700 leading-relaxed">{team.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center bg-purple-100 rounded-lg p-4">
                <FaUsers className="text-purple-600 text-2xl mr-4" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Members Required</p>
                  <p className="text-2xl font-bold text-purple-800">{team.members_required}</p>
                </div>
              </div>
              <div className="flex items-center bg-purple-100 rounded-lg p-4">
                <FaCalendarAlt className="text-purple-600 text-2xl mr-4" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Created On</p>
                  <p className="text-2xl font-bold text-purple-800">{new Date(team.created_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-purple-700 mb-3">Required Skills</h2>
              <div className="flex flex-wrap">
                {team.skills_required.map((skill) => (
                  <span key={skill.id} className="bg-purple-200 text-purple-800 rounded-full px-4 py-2 text-sm font-semibold mr-2 mb-2 transition-all duration-300 hover:bg-purple-300">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {!isInterested ? (
              <button
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-purple-700 transition duration-300 flex items-center justify-center"
                onClick={handleInterest}
              >
                <FaUserTie className="mr-2" />
                Express Interest
              </button>
            ) : (
              <div className={`w-full py-3 px-6 rounded-lg text-lg font-semibold flex items-center justify-center ${
                interestStatus === 'Accepted' ? 'bg-green-100 text-green-800' : 
                interestStatus === 'Rejected' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {interestStatus === 'Accepted' && <FaCheckCircle className="mr-2" />}
                {interestStatus === 'Rejected' && <FaTimesCircle className="mr-2" />}
                {interestStatus === 'Pending' && <FaUserTie className="mr-2" />}
                Interest Status: {interestStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInvitationDetail;