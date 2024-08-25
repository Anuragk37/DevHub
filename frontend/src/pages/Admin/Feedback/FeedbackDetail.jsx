import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import Header from "../../../components/Admin/Header";
import SideBar from "../../../components/Admin/SideBar";
import { FaStar, FaArrowLeft } from "react-icons/fa";

const FeedbackDetail = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbackDetail = async () => {
      try {
        const response = await axiosInstance.get(`/admin/feedback/${id}/`);
        setFeedback(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch feedback details");
        setLoading(false);
      }
    };
    fetchFeedbackDetail();
  }, [id]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-4 md:ml-64">
          <div className="max-w-5xl mx-auto">
            <Link
              to="/admin/feedback-list"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 transition duration-300"
            >
              <FaArrowLeft className="mr-2" /> Back to Feedbacks
            </Link>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Feedback Details
            </h2>
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600">Loading feedback details...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {renderStars(feedback.rating)}
                      <span className="ml-2 text-gray-600">
                        ({feedback.rating}/5)
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(feedback.date).toLocaleString()}
                    </span>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Feedback
                    </h3>
                    <p className="text-gray-700">{feedback.feedback}</p>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Suggestions for Improvement
                    </h3>
                    <p className="text-gray-700">{feedback.improvement}</p>
                  </div>
                </div>
                {feedback.image && (
                  <div className="border-t border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 p-6 pb-3">
                      Attached Image
                    </h3>
                    <div className="px-6 pb-6">
                      <img
                        src={feedback.image}
                        alt="Feedback"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetail;
