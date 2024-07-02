import React, { useState, useEffect } from 'react';
import Header from '../../../components/Admin/Header';
import SideBar from '../../../components/Admin/SideBar';
import axiosInstance from '../../../utils/axiosInstance';
import { Link } from 'react-router-dom';

const ReportedArticleList = () => {
  const [reportedArticles, setReportedArticles] = useState([]);

  const getArticles = async () => {
    try {
      const response = await axiosInstance.get('/article/reported-articles/');
      console.log('Fetched articles:', response.data);
      setReportedArticles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  const handleDelete = (id) => {
    try {
      axiosInstance.delete(`/article/${id}/`);
      getArticles();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header />
      <SideBar />
      <div className="flex justify-center min-h-full sm:mx-5 md:ml-64 mt-4 px-4">
        <div className="w-5/6 overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-white uppercase bg-[#0B304D]">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-lg">SL No</th>
                <th scope="col" className="px-6 py-3">Article Title</th>
                <th scope="col" className="px-6 py-3">Author</th>
                <th scope="col" className="px-6 py-3">Number of Reports</th>
                <th scope="col" className="px-6 py-3 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {reportedArticles.map((article, index) => (
                <tr key={article.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <Link to="/admin/reported-article/" state={article}>
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{article.auther.fullname}</td>
                  <td className="px-6 py-4 text-gray-600">{article.reports}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      Delete
                    </button>
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

export default ReportedArticleList;
