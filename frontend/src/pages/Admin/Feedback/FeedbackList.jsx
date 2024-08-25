import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import Header from "../../../components/Admin/Header";
import SideBar from "../../../components/Admin/SideBar";
import { FaStar } from "react-icons/fa";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosInstance.get("/admin/feedback/");
        setFeedbacks(response.data.results);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch feedbacks");
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div>
      <Header />
      <SideBar />
      <div className="flex flex-col min-h-screen sm:ml-64 mt-8 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Feedbacks</h2>
        {loading ? (
          <p className="text-gray-600">Loading feedbacks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {feedbacks.map((feedback) => (
              <Link
                key={feedback.id}
                to={`/admin/feedback/${feedback.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {renderStars(feedback.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(feedback.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-2 line-clamp-2">
                    {feedback.feedback}
                  </p>
                  <p className="text-sm text-purple-600 font-semibold">
                    View Details →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;