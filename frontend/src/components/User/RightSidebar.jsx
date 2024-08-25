import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaHashtag, FaBookOpen, FaLightbulb, FaNewspaper } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RightSidebar = () => {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useSelector((state) => state.auth.isUserAuthenticated);

  const dummyFeaturedArticles = [
    {
      id: 1,
      title: "The Future of AI in Healthcare",
      author: { username: "ai_expert" },
      brief_description: "Exploring how artificial intelligence is revolutionizing medical diagnoses and treatment plans."
    },
    {
      id: 2,
      title: "Sustainable Living: Small Changes, Big Impact",
      author: { username: "eco_warrior" },
      brief_description: "Practical tips for reducing your carbon footprint and living a more sustainable lifestyle."
    },
    {
      id: 3,
      title: "The Rise of Remote Work: Challenges and Opportunities",
      author: { username: "future_of_work" },
      brief_description: "Analyzing the shift towards remote work and its implications for businesses and employees."
    }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const trendingTopicsResponse = await axiosInstance.get('/article/trending-tags');
      setTrendingTopics(trendingTopicsResponse.data);
      
      // Use dummy featured articles instead of API call
      setFeaturedArticles(dummyFeaturedArticles);

      if (isAuthenticated) {
        const [usersResponse, articlesResponse] = await Promise.all([
          axiosInstance.get('/recommendations/user'),
          axiosInstance.get('/article/recently-viewed/')
        ]);
        setRecommendedUsers(usersResponse.data);
        setRecentArticles(articlesResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const ShimmerEffect = ({ lines = 3 }) => (
    <div className="animate-pulse space-y-2">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded"></div>
      ))}
    </div>
  );

  const ProTip = () => {
    const tip = isAuthenticated
      ? "Engage with the community by following experts in your field!"
      : "Sign in to get personalized recommendations and track your reading history!";

    return (
      <div className="bg-yellow-50 p-4">
        <h3 className="font-semibold flex items-center mb-2 text-yellow-800">
          <FaLightbulb className="mr-2 text-yellow-500" /> Pro Tip
        </h3>
        <p className="text-sm text-yellow-700">{tip}</p>
      </div>
    );
  };

  return (
    <div className="w-80 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
        <h2 className="text-2xl font-bold">Discover & Connect</h2>
        <p className="text-sm opacity-80">Stay updated with the latest trends and connections</p>
      </div>
      
      <div className="p-6 space-y-6">
        {isAuthenticated && (
          <>
            {/* Recommended Users Section */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-700">
                <FaUserCircle className="mr-2 text-purple-500" /> People to Follow
              </h3>
              {loading ? (
                <ShimmerEffect lines={3} />
              ) : (
                <div className="space-y-3">
                  {recommendedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <Link to={`/user/profile/${user.id}`} className="flex items-center space-x-3">
                        <img src={user.profile_pic} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-800">{user.fullname}</p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                      </Link>
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Recently Read Articles Section */}
            <section>
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-700">
                <FaBookOpen className="mr-2 text-green-500" /> Recent Reads
              </h3>
              {loading ? (
                <ShimmerEffect lines={3} />
              ) : (
                <div className="space-y-3">
                  {recentArticles.map((article) => (
                    <div key={article.id} className="border-l-4 border-green-400 pl-3">
                      <Link to={`/user/view-article/${article.article.id}`}>
                        <h4 className="font-medium text-gray-800">{article.article.title}</h4>
                      </Link>
                      <p className="text-sm text-gray-600">{article.article.auther.username}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* Trending Topics Section */}
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-700">
            <FaHashtag className="mr-2 text-indigo-500" /> Trending Now
          </h3>
          {loading ? (
            <ShimmerEffect lines={2} />
          ) : (
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, index) => (
                <Link to={`/user/tag/${topic.id}` } state={{ tagName: topic.name }} key={topic.id}>
                  <span  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm hover:bg-indigo-200 cursor-pointer transition-colors">
                    #{topic.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Featured Articles Section (for both authenticated and unauthenticated users) */}
        <section>
          <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-700">
            <FaNewspaper className="mr-2 text-blue-500" /> Featured Articles
          </h3>
          {loading ? (
            <ShimmerEffect lines={3} />
          ) : (
            <div className="space-y-3">
              {featuredArticles.map((article) => (
                <div key={article.id} className="border-l-4 border-blue-400 pl-3">
                  <Link to={`/user/view-article/${article.id}`}>
                    <h4 className="font-medium text-gray-800">{article.title}</h4>
                  </Link>
                  <p className="text-sm text-gray-600">{article.author.username}</p>
                  <p className="text-xs text-gray-500">{article.brief_description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <ProTip />
    </div>
  );
};

export default RightSidebar;