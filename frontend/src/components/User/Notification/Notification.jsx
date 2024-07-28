import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';


const Notification = ({ lastMessage }) => {
  const [notifications, setNotifications] = useState([]);

  const userAccessToken = useSelector((state) => state.auth.userAccessToken);
  const userId = jwtDecode(userAccessToken).user_id;


  useEffect(() => {
   if (lastMessage !== null) {
     const notifi = JSON.parse(lastMessage);
     
     setNotifications(prev => [notifi.message, ...prev]);
   }
 }, [lastMessage]);

 useEffect(() => {
   fetchNotifications();
 }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notification_chat/notifications/');
      setNotifications(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
   //  try {
   //    await axiosInstance.patch(`/notifications/${notificationId}/mark-as-read/`);
   //    fetchNotifications(); // Refresh notifications
   //  } catch (error) {
   //    console.error('Error marking notification as read:', error);
   //  }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50">
      <div className="p-4 bg-purple-900 text-white font-bold flex justify-between items-center">
        <h3>Notifications</h3>
        <FaTimes className="cursor-pointer" onClick={() => {}} />
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-4 text-gray-500">No new notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b ${
                notification.is_read ? 'bg-gray-100' : 'bg-white'
              } hover:bg-gray-50 transition-colors duration-150 ease-in-out`}
            >
              <p className="text-sm text-gray-800">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.created_at).toLocaleString()}
              </p>
              {/* {!notification.is_read && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="mt-2 text-xs text-purple-600 hover:text-purple-800"
                >
                  Mark as read
                </button>
              )} */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;