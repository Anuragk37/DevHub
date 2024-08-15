import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLink, FaBookmark, FaEllipsisV, FaComment, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Articles = ({ article, from_profile = false, deleteArticle, isOwnProfile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  console.log("article", article);
  

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditArticle = () => {
    navigate('/user/create-article', { state: { initialData: article, fromEdit: true } });
  };

  const handleDeleteArticle = () => {
    deleteArticle(article.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden mb-6">
      <div className="flex flex-col-reverse md:flex-row p-6">
        <div className="flex-grow pr-0 md:pr-6">
          <div className="flex justify-between items-start mb-4">
            <Link to={`/user/view-article/${article.id}`} className="block text-2xl leading-tight font-bold text-purple-900 hover:text-purple-700 transition-colors duration-200">
              {article.title}
            </Link>
            {isOwnProfile && (
              <div className="relative flex">
                {article.flaged && (
                  <h1 className='bg-red-500 text-sm text-white p-1 px-2 m-1 rounded-full flex items-center space-x-2'>on review</h1>
                )}
                <button onClick={handleToggleDropdown} className="text-gray-500 hover:text-purple-700 transition-colors duration-200">
                  <FaEllipsisV />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <button onClick={handleEditArticle} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 transition-colors duration-200">
                      Edit
                    </button>
                    <button onClick={handleDeleteArticle} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 transition-colors duration-200">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <hr className="border-t border-purple-100 mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img className="h-10 w-10 rounded-full border-2 border-purple-200" src={article.auther.profile_pic || '/default-avatar.png'} alt={article.auther.fullname} />
              <div>
                <p className="font-semibold text-purple-700">{article.auther.fullname || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{new Date(article.create_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-gray-500">
              <div className="flex items-center space-x-1">
                <FaHeart className="" />
                <span>{article.like_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaComment className="text-purple-600" />
                <span>{article.comment_count || 0}</span>
              </div>
              {/* <button className="hover:text-purple-600 transition-colors duration-200" title="Share"><FaLink /></button> */}
              <button className="hover:text-purple-600 transition-colors duration-200" title="Bookmark"><FaBookmark /></button>
            </div>
          </div>
        </div>
        {article.thumbnail && (
          <div className="md:flex-shrink-0 mb-4 md:mb-0 md:ml-6">
            <img
              className="h-32 w-full md:w-48 object-cover rounded-lg"
              src={article.thumbnail_url}
              alt={article.title}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;