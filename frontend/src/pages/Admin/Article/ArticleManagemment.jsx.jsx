import React, { useState, useEffect } from 'react';
import Header from '../../../components/Admin/Header';
import SideBar from '../../../components/Admin/SideBar';
import axiosInstance from '../../../utils/axiosInstance';
import { Link } from 'react-router-dom';

const ArticleManagement = () => {
  const [articles, setArticles] = useState([]);

  const getArticles = async () => {
    try {
      const response = await axiosInstance.get('/article/');
      console.log('Fetched articles:', response.data);
      setArticles(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <div>
      <Header />
      <SideBar />
      <div className="flex justify-center min-h-full sm:mx-5 md:ml-64 mt-4 px-4">
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-light-blue-700">
              <tr>
                {['Sl No', 'Title', 'Author', 'Created Date', 'Likes', 'Comments'].map((header) => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article, index) => (
                <tr key={article.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/admin/view-article/${article.id}/`} 
                      className="text-sm font-medium text-blue-600 hover:text-blue-900"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{article.auther.fullname}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(article.create_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{article.like_count}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{article.comment_count}</div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors duration-200">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ArticleManagement;
