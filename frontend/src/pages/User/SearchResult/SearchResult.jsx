import React, { useState, useEffect } from 'react';
import { FaSearch, FaNewspaper, FaUsers, FaUserFriends } from 'react-icons/fa';
import Header from '../../../components/User/Header';
import SideBar from '../../../components/User/SideBar';
import Articles from '../../../components/User/Articles';
import axiosInstance from '../../../utils/axiosInstance';
import BaseUrl from '../../../utils/BaseUrls';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SearchResult = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [results, setResults] = useState({ articles: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const SearchResult = location.state;
  console.log(SearchResult);

  useEffect(() => {
   console.log(typeof(SearchResult));
   console.log(SearchResult);
   setResults(SearchResult.results)
  },[SearchResult])

  const tabs = [
    { id: 'articles', label: 'Articles', icon: FaNewspaper },
    { id: 'users', label: 'Users', icon: FaUserFriends },
    { id: 'communities', label: 'Communities', icon: FaUsers },
  ];

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axiosInstance.get(`${BaseUrl}/search/${activeTab}?q=${searchQuery}`);
//       setResults(response.data);
//     } catch (error) {
//       setError('Failed to fetch search results. Please try again.');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };


  const renderResults = () => {
    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    switch (activeTab) {
      case 'articles':
        if (results['articles'].length === 0) return <div className="text-center py-8">No articles found.</div>;
        return results.articles.map((article) => (
          <Articles key={article.id} article={article} />
        ));
      case 'users':
        if (results['users'].length === 0) return <div className="text-center py-8">No users found.</div>;
        return results.users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center">
            
            <img src={user.profile_pic || '/default-avatar.png'} alt={user.fullname} className="w-12 h-12 rounded-full mr-4" />
            <Link to={`/user/profile/${user.id}`}>
            <div>
              <h3 className="font-semibold">{user.fullname}</h3>
              <p className="text-sm text-gray-500">{user.username}</p>
            </div>
            </Link>
          </div>
        ));
      // case 'communities':
      //   return results.map((community) => (
      //     <div key={community.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      //       <h3 className="font-semibold">{community.name}</h3>
      //       <p className="text-sm text-gray-500">{community.description}</p>
      //       <p className="text-xs text-gray-400 mt-2">Members: {community.member_count}</p>
      //     </div>
      //   ));
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-col lg:flex-row w-full px-6 mt-16 lg:px-20 py-6">
        <div className="hidden md:block md:w-1/5 mr-6">
          <SideBar />
        </div>
        <div className="w-full md:w-4/5 lg:w-3/5 lg:px-4">

          <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 font-semibold transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-500 hover:text-purple-600'
                  }`}
                >
                  <tab.icon className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {renderResults()}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;