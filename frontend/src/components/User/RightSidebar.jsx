import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaHashtag, FaBookOpen, FaLightbulb } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';

const RightSidebar = () => {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);

  // Mock data
  const mockTrendingTopics = [
    'ReactJS', 'Web Development', 'JavaScript', 'Frontend', 'Tech'
  ];

  const mockRecentArticles = [
    { id: 1, title: 'Understanding React Hooks', summary: 'A deep dive into React Hooks.' },
    { id: 2, title: 'CSS Grid Layout Tutorial', summary: 'Learn the basics of CSS Grid Layout.' },
    { id: 3, title: 'JavaScript ES6 Features', summary: 'Explore new features in ES6.' }
  ];

  const fetchData = async () => {
    try {
      const usersResponse = await axiosInstance.get('/recommendations/user');
      setRecommendedUsers(usersResponse.data);
      setTrendingTopics(mockTrendingTopics);
      setRecentArticles(mockRecentArticles);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-80 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
        <h2 className="text-2xl font-bold">Discover & Connect</h2>
        <p className="text-sm opacity-80">Stay updated with the latest trends and connections</p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Recommended Users Section */}
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-700">
            <FaUserCircle className="mr-2 text-purple-500" /> People to Follow
          </h3>
          <div className="space-y-3">
            {recommendedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={user.profile_pic} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-gray-800">{user.fullname}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Topics Section */}
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-700">
            <FaHashtag className="mr-2 text-indigo-500" /> Trending Now
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic, index) => (
              <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm hover:bg-indigo-200 cursor-pointer transition-colors">
                #{topic}
              </span>
            ))}
          </div>
        </section>

        {/* Recently Read Articles Section */}
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-700">
            <FaBookOpen className="mr-2 text-green-500" /> Recent Reads
          </h3>
          <div className="space-y-3">
            {recentArticles.map((article) => (
              <div key={article.id} className="border-l-4 border-green-400 pl-3">
                <h4 className="font-medium text-gray-800">{article.title}</h4>
                <p className="text-sm text-gray-600">{article.summary}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Pro Tip Section */}
      <div className="bg-yellow-50 p-4">
        <h3 className="font-semibold flex items-center mb-2 text-yellow-800">
          <FaLightbulb className="mr-2 text-yellow-500" /> Pro Tip
        </h3>
        <p className="text-sm text-yellow-700">Engage with the community by following experts in your field!</p>
      </div>
    </div>
  );
};

export default RightSidebar;

