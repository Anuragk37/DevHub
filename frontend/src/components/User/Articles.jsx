import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { FaLink, FaBookmark } from 'react-icons/fa';
import axios from 'axios';
import BaseUrl from '../../utils/BaseUrls';

const Articles = ({ article }) => {
   const [auther, setAuther] = useState({});

   const  getUser = async () => {
      try {
         const response = await axios.get(`${BaseUrl}/account/user/${article.auther}/`);
         console.log(response.data);
         setAuther(response.data);
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      getUser();
   }, []);
  return (
    <Link to={`/user/view-article/${article.id}`} className="block">
      <div className="article-container w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col md:flex-row mb-6">
        <div className="article-content flex-grow md:pr-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">{article.title}</h1>
          <div className="article-meta flex items-center justify-between text-gray-500 text-sm mt-auto pt-4 border-t">
            <div className="flex items-center">
              <span className="mr-4">Author: {auther.fullname || 'Unknown'}</span>
              <span className="mr-4">Comments: {article.comment_count || 0}</span>
              <span>Created at: {new Date(article.create_at).toLocaleDateString()}</span>
            </div>
            <div className="flex space-x-4">
              <FaLink className="text-gray-600 hover:text-gray-800 cursor-pointer" />
              <FaBookmark className="text-gray-600 hover:text-gray-800 cursor-pointer" />
            </div>
          </div>
        </div>
        {article.thumbnail && (
          <div className="article-image w-full md:w-1/5 mt-4 md:mt-0 flex justify-end items-center">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="rounded-lg object-cover h-full w-full md:w-auto"
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default Articles;
