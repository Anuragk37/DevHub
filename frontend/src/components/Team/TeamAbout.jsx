import React, { useState } from 'react';
import { FaUser, FaCalendarAlt, FaUsers, FaGithub } from 'react-icons/fa';

const TeamAbout = ({ team, isCreator, onUpdateGithub }) => {
  const [newGithubLink, setNewGithubLink] = useState('');

  const handleGithubLinkSubmit = (e) => {
    e.preventDefault();
    onUpdateGithub(newGithubLink);
    setNewGithubLink('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-purple-600 mb-4">About Our Team</h2>
      <p className="text-gray-600 text-base leading-relaxed">{team.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-xl shadow-md">
          <FaUser className="text-purple-500 mb-2 text-xl" />
          <p className="font-semibold">Leader</p>
          <p className="text-sm text-gray-600">{team.creator.fullname}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl shadow-md">
          <FaCalendarAlt className="text-purple-500 mb-2 text-xl" />
          <p className="font-semibold">Created</p>
          <p className="text-sm text-gray-600">{new Date(team.created_date).toLocaleDateString()}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl shadow-md">
          <FaUsers className="text-purple-500 mb-2 text-xl" />
          <p className="font-semibold">Members</p>
          <p className="text-sm text-gray-600">{team.member_count}</p>
        </div>
      </div>
      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
          <FaGithub className="mr-2 text-purple-500" />
          GitHub Repository
        </h3>
        {team.github_link ? (
          <a
            href={team.github_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center"
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
              className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded-r-lg hover:bg-purple-600 transition duration-300 text-sm font-semibold"
            >
              Add
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeamAbout;