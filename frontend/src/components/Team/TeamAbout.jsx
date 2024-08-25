import React, { useState } from 'react';
import { FaUser, FaCalendarAlt, FaUsers, FaGithub, FaHandshake, FaTrophy, FaClock, FaCode } from 'react-icons/fa';

const TeamAbout = ({ team, isCreator, onUpdateGithub }) => {
  const [newGithubLink, setNewGithubLink] = useState('');

  const handleGithubLinkSubmit = (e) => {
    e.preventDefault();
    onUpdateGithub(newGithubLink);
    setNewGithubLink('');
  };

  // Dummy data for additional statistics
  const additionalStats = {
    totalMeetings: 42,
    projectsCompleted: 15,
    avgWeeklyHours: 25,
    linesOfCode: 150000,
  };

  return (
    <div className="">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">About Our Team</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={FaUser} title="Leader" value={team.creator.fullname} />
        <StatCard icon={FaCalendarAlt} title="Created" value={new Date(team.created_date).toLocaleDateString()} />
        <StatCard icon={FaUsers} title="Members" value={team.member_count} />
        <StatCard icon={FaHandshake} title="Meetings" value={additionalStats.totalMeetings} />
        <StatCard icon={FaTrophy} title="Projects Completed" value={additionalStats.projectsCompleted} />
        <StatCard icon={FaClock} title="Avg. Weekly Hours" value={`${additionalStats.avgWeeklyHours}h`} />
      </div>

      <div className="border-t border-purple-200 pt-6 mt-8">
        <h3 className="text-2xl font-semibold mb-4 flex items-center text-purple-700">
          <FaGithub className="mr-3 text-purple-600" />
          GitHub Repository
        </h3>
        {team.github_link ? (
          <a
            href={team.github_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center text-lg"
          >
            <FaGithub className="mr-2" />
            {team.github_link}
          </a>
        ) : isCreator && (
          <form onSubmit={handleGithubLinkSubmit} className="flex">
            <input
              type="url"
              value={newGithubLink}
              onChange={(e) => setNewGithubLink(e.target.value)}
              placeholder="Enter GitHub repository URL"
              className="flex-grow px-4 py-2 border-2 border-purple-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
              required
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-r-lg hover:bg-purple-700 transition duration-300 text-base font-semibold"
            >
              Add
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
    <Icon className="text-purple-500 mb-3 text-3xl" />
    <p className="font-semibold text-gray-700 mb-1">{title}</p>
    <p className="text-lg text-purple-600 font-bold">{value}</p>
  </div>
);

export default TeamAbout;