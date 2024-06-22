import React, { useState, useEffect } from 'react';
import Header from '../../components/User/Header';
import SideBar from '../../components/User/SideBar';
import axios from 'axios';
import BaseUrl from '../../utils/BaseUrls';
import Articles from '../../components/User/Articles';
import RightSidebar from '../../components/User/RightSidebar';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  const getArticles = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/article/`);
      setArticles(response.data);
    } catch (error) {
      setError('Failed to load articles. Please try again later.');
      console.log(error);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col lg:flex-row w-screen px-6 mt-16 lg:px-24 bg-background py-6">
        <div className="hidden md:block md:w-1/5 mr-6">
          <SideBar />
        </div>
        <div className="w-full md:w-4/5 lg:w-3/5 lg:px-4">
          {error && <div className="text-red-500">{error}</div>}
          {articles.map((article) => (
            <Articles key={article.id} article={article} />
          ))}
        </div>
        <div className="hidden lg:block lg:w-1/5 ">
          <RightSidebar />
        </div>
      </div>
      
    </div>

  );
};

export default HomePage;
