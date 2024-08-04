import React, { useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';

const ReportModal = ({ isOpen, onClose, userId }) => {
  const [reason, setReason] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleScreenshotChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('reason', reason);
    if (screenshot) {
      formData.append('screenshot', screenshot);
    }
    formData.append('reported_user', userId);

    try {
      await axiosInstance.post('account/report-user/', formData)
      onClose();
      // Show success message
    } catch (error) {
      console.error('Error submitting report:', error);
      // Show error message
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Report User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FaTimes className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for reporting
            </label>
            <textarea
              id="reason"
              rows="4"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-purple-500"
              value={reason}
              onChange={handleReasonChange}
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Screenshot (optional)
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="screenshot"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  id="screenshot"
                  type="file"
                  className="hidden"
                  onChange={handleScreenshotChange}
                  accept="image/*"
                />
              </label>
            </div>
            {screenshot && <p className="mt-2 text-sm text-gray-500">{screenshot.name}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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