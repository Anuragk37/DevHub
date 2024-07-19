import React from 'react';
import { useNavigate } from 'react-router-dom';
const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/signin');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10">
        <h2 className="text-xl font-bold mb-4">Login Required</h2>
        <p className="mb-4">You need to be logged in to follow users.</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Close
          </button>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
