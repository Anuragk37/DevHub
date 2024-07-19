import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLink, FaBookmark } from 'react-icons/fa';
import axios from 'axios';
// import BaseUrl from '../../utils/BaseUrls';
import { HiDotsVertical } from "react-icons/hi";
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Articles = ({ article, from_profile = false ,deleteArticle,isOwnProfile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate()
  

  const accessToken = useSelector((state) => state.auth.userAccessToken);

  

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditArticle = () => {
    navigate('/user/create-article', { state: { initialData: article, fromEdit: true } });
  };

  const handleDeleteArticle = async () => {
    deleteArticle(article.id)
  };

  return (
    <div className="article-container w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col md:flex-row mb-6">
      <div className="article-content flex-grow md:pr-4">
        <Link to={`/user/view-article/${article.id}`}>
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">{article.title}</h1>
        </Link>
        <div className="article-meta flex items-center justify-between text-gray-500 text-sm mt-auto pt-4 border-t">
          <div className="flex items-center">
            <span className="mr-4">Author: {article.auther.fullname || 'Unknown'}</span>
            <span className="mr-4">Comments: {article.comment_count || 0}</span>
            <span>Created at: {new Date(article.create_at).toLocaleDateString()}</span>
          </div>
          {/* <div className="flex space-x-4">
            <FaLink className="text-gray-600 hover:text-gray-800 cursor-pointer" />
            <FaBookmark className="text-gray-600 hover:text-gray-800 cursor-pointer" />
            
          </div>
         */}
        </div>
      </div>
      {article.thumbnail && (
        <div className="article-image w-full md:w-1/5 mt-4 md:mt-0 flex justify-end items-center">
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-80 h-24 object-cover rounded-lg"
          />
        </div>
      )}

      {isOwnProfile  && (
        <div>
          <HiDotsVertical className="text-gray-600 hover:text-gray-800 cursor-pointer ml-2" onClick={handleToggleDropdown} />
          {isDropdownOpen && (
            <div className="dropdown absolute mt-1 ml-6 w-28 bg-white border rounded-lg shadow-lg py-1">
              <button onClick={handleEditArticle} className="block px-4 py-2 text-purple-900 hover:bg-purple-100 w-full text-left">Edit</button>
              <button onClick={handleDeleteArticle} className="block px-4 py-2 text-purple-900 hover:bg-purple-100 w-full text-left">Delete</button>
            </div>
          )}
        </div>
        )}
    </div>
  );
};

export default Articles;
