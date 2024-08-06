import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUsers, FaPlus, FaTrash, FaVideo, FaChevronRight } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const TeamMeeting = ({ teamId, isCreator }) => {
  const [meetings, setMeetings] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    team: teamId
  });
  const [activeTab, setActiveTab] = useState('upcoming');

  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetings();
  }, [teamId]);

  const fetchMeetings = async () => {
    try {
      const response = await axiosInstance.get(`/team/meeting/${teamId}/`);
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/team/meeting/`, newMeeting);
      setShowScheduleForm(false);
      setNewMeeting({ title: '', date: '', time: '' });
      fetchMeetings();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await axiosInstance.delete(`/team/meeting-detail/${meetingId}/`);
      fetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const isMeetingActive = (date, time) => {
    const meetingDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffMinutes = (meetingDateTime - now) / (1000 * 60);
    return diffMinutes >= -30 && diffMinutes <= 60;
  };

  const handleStartConference = () => {
   navigate(`/user/team/video-conference/${teamId}`);
  };

  const getUpcomingMeetings = () => meetings.filter(meeting => new Date(`${meeting.date}T${meeting.time}`) > new Date());
  const getPastMeetings = () => meetings.filter(meeting => new Date(`${meeting.date}T${meeting.time}`) <= new Date());

  const MeetingList = ({ meetings, isPast }) => (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
          <div className="flex items-center p-4">
            <div className="flex-grow">
              <h4 className="text-lg font-semibold text-gray-800 mb-1">{meeting.title}</h4>
              <div className="flex items-center text-sm text-gray-600">
                <FaCalendarAlt className="mr-2 text-purple-500" />
                {formatDate(meeting.date)}
                <FaClock className="ml-4 mr-2 text-purple-500" />
                {formatTime(meeting.time)}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isPast && (
                isMeetingActive(meeting.date, meeting.time) ? (
                  <button onClick={handleStartConference} className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-green-600 transition duration-300 flex items-center">
                    <FaVideo className="mr-1" />
                    Join
                  </button>
                ) : (
                  <span className="text-gray-500 text-sm">Upcoming</span>
                )
              )}
              {isCreator && !isPast && (
                <button
                  onClick={() => handleDeleteMeeting(meeting.id)}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center">
        <FaCalendarAlt className="mr-3" />
        Team Meetings
      </h2>

      {isCreator && (
        <div className="mb-8">
          {!showScheduleForm ? (
            <button
              onClick={() => setShowScheduleForm(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center shadow-md"
            >
              <FaPlus className="mr-2" />
              Schedule New Meeting
            </button>
          ) : (
            <form onSubmit={handleScheduleMeeting} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-purple-700">Schedule New Meeting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Meeting Title"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 shadow-md"
                >
                  Schedule
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {meetings.length === 0 ? (
        <h1>There are no scheduled meetings at this time.</h1>
      ) : (
        <div className="space-y-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === 'upcoming'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Meetings
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                activeTab === 'history'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Meeting History
            </button>
          </div>

          {activeTab === 'upcoming' && (
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-purple-700">Upcoming Meetings</h3>
              <MeetingList meetings={getUpcomingMeetings()} isPast={false} />
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-purple-700">Meeting History</h3>
              <MeetingList meetings={getPastMeetings()} isPast={true} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMeeting;