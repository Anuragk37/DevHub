import React, { useState, useEffect } from 'react';
import Header from '../../../components/Admin/Header';
import SideBar from '../../../components/Admin/SideBar';
import axiosInstance from '../../../utils/axiosInstance';
import { Link } from 'react-router-dom';

const ArticleManagement = () => {
  const [articles, setArticles] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const getArticles = async (page = 1) => {
    try {
      const response = await axiosInstance.get(`/article/?page=${page}`);
      console.log('Fetched articles:', response.data);
      setArticles(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  const handleNextPage = () => {
    if (nextPage) {
      const nextPageNumber = currentPage + 1;
      getArticles(nextPageNumber);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      const prevPageNumber = currentPage - 1;
      getArticles(prevPageNumber);
    }
  };

  return (
    <div>
      <Header />
      <SideBar />
      <div className="flex flex-col justify-center min-h-full sm:mx-5 md:ml-64 mt-4 px-4">
        <div className="overflow-x-auto shadow-md rounded-lg mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-admin-sideBar h-14">
              <tr>
                {['Sl No', 'Title', 'Author', 'Created Date', 'Likes', 'Comments'].map((header) => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article, index) => (
                <tr key={article.id} className="transition-all hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(currentPage - 1) * 10 + index + 1}
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
        <div className="flex justify-between">
          <button
            onClick={handlePrevPage}
            disabled={!prevPage}
            className={`px-4 py-2 font-bold text-white rounded ${prevPage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={!nextPage}
            className={`px-4 py-2 font-bold text-white rounded ${nextPage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleManagement;
