import React, { useState, useEffect } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';

const ReportModal = ({ isOpen, onClose, id }) => {
  const [reason, setReason] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async(e) => {
    e.preventDefault();    
    const data = {
      article_id: id,
      reason
    }
    try {
      await axiosInstance.post(`/article/report-article/`, data);
      onClose()
      setReason('');
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={() => {
        setIsAnimating(false);
        setTimeout(() => onClose(), 300);
      }}
    >
      <div 
        className={`bg-white rounded-lg p-8 max-w-md w-full shadow-2xl transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
            Report Article
          </h2>
          <button 
            onClick={() => {
              setIsAnimating(false);
              setTimeout(() => onClose(), 300);
            }} 
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for reporting
            </label>
            <textarea
              id="reason"
              className="w-full px-3 py-2 text-gray-700 shadow-equel shadow-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              placeholder="Please provide details about why you're reporting this article..."
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setIsAnimating(false);
                setTimeout(() => onClose(), 300);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;