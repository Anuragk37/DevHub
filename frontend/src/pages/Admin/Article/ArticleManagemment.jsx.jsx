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
      console.log(response.data);
      setArticles(response.data.results);
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
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-800 to-blue-900 h-14">
            <tr>
              {['Sl No', 'Title', 'Author', 'Created Date', 'Likes', 'Comments'].map((header) => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-sm font-bold  text-white uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article, index) => (
              <tr key={article.id} className="transition-all hover:bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    to={`/admin/view-article/${article.id}/`} 
                    className="text-md font-medium text-blue-900 hover:text-blue-800 transition-colors"
                  >
                    {article.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-md text-gray-700">{article.auther.fullname}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-md text-gray-700">{new Date(article.create_at).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-md text-gray-700">{article.like_count}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-md text-gray-700">{article.comment_count}</div>
                </td>
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
