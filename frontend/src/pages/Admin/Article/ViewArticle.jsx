import React, { useEffect, useState } from "react";
import Header from "../../../components/Admin/Header";
import SideBar from "../../../components/Admin/SideBar";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";

const ViewArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  const getArticle = async () => {
    try {
      const response = await axiosInstance.get(`/article/${id}`);
      setArticle(response.data);
    } catch (error) {
      console.error("Error fetching article:", error);
    }
  };

  useEffect(() => {
    getArticle();
  }, [id]);

  if (!article) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <div className="flex">
          <SideBar />
          <div className="flex-1 p-4 md:ml-64">
            <p className="text-center">Loading article data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-4 md:ml-64">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Author Details Section */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="bg-blue-400 p-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Author Details
                  </h2>
                </div>
                <div className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6">
                    <img
                      src={
                        article.auther.profile_pic ||
                        "https://via.placeholder.com/100"
                      }
                      alt={article.auther.fullname}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md mb-4 sm:mb-0 sm:mr-6"
                    />
                    <div className="text-center sm:text-left">
                      <p className="font-bold text-lg md:text-xl text-gray-800">
                        {article.auther.fullname}
                      </p>
                      <p className="text-blue-600 font-medium">
                        @{article.auther.username}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-600 text-sm md:text-base">
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="break-all">{article.auther.email}</span>
                    </p>
                    <p className="flex items-center text-gray-600 text-sm md:text-base">
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {article.auther.phone_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* Article Details Section */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="bg-blue-400 p-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Article Details
                  </h2>
                </div>
                <div className="p-4 md:p-6">
                  <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                    {article.title}
                  </h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-3 md:p-4 flex items-center">
                      <svg
                        className="w-6 h-6 md:w-8 md:h-8 text-blue-500 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">Created on</p>
                        <p className="font-semibold text-sm md:text-base">
                          {new Date(article.create_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 md:p-4 flex items-center">
                      <svg
                        className="w-6 h-6 md:w-8 md:h-8 text-red-500 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">Likes</p>
                        <p className="font-semibold text-sm md:text-base">{article.like_count}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 md:p-4 flex items-center">
                    <svg
                      className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Comments</p>
                      <p className="font-semibold text-sm md:text-base">{article.comment_count}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Article Section */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
                  Full Article
                </h2>
                <div
                  className="prose max-w-none text-sm md:text-base"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewArticle;