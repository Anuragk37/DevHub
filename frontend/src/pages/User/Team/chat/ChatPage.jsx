import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FaPaperclip, FaSmile, FaPaperPlane, FaUsers, FaEllipsisV, FaSearch, FaVideo, FaPhoneAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../../utils/axiosInstance';
import WS_URL from '../../../../utils/BaseUrls';
import useWebSocket from 'react-use-websocket';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const ChatPage = () => {
  const [newMessage, setNewMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const messageContainerRef = useRef(null);

  const location = useLocation();
  const team = location.state?.team;

  const accessToken = useSelector(state => state.auth.userAccessToken);

  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const userId = decodedToken ? decodedToken.user_id : null;

  const { sendMessage, lastMessage, readyState } = useWebSocket(`${WS_URL}/teamchat/${team?.id}/?token=${accessToken}`);

  useEffect(() => {
    if (lastMessage !== null) {
      const messageData = JSON.parse(lastMessage.data);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    }
  }, [lastMessage]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axiosInstance.get(`notification_chat/teamchat/${team?.id}/`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
    getMessages();
  }, [team?.id]);

  useEffect(() => {
    if (team?.id) {
      axiosInstance.get(`/team/team-member/${team.id}/`)
        .then(response => {
          setMembers(response.data);
        })
        .catch(error => {
          console.error('Error fetching team members:', error);
        });
    }
  }, [team?.id]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback((event) => {
    event.preventDefault();
    if (newMessage.trim() && readyState === WebSocket.OPEN) {
      sendMessage(JSON.stringify({
        message: newMessage.trim(),
      }));
      setNewMessage('');
    }
  }, [newMessage, sendMessage, readyState]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMessageClick = (messageId) => {
    setSelectedMessageId(messageId === selectedMessageId ? null : messageId);
  };

  if (!team) {
    return <div>No team data available. Please go back and select a team.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 p-4 space-y-4 lg:space-y-0 lg:space-x-4">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-1/4 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col`}>
        <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <h2 className="text-2xl font-bold">{team.name}</h2>
          <p className="text-sm opacity-75 mt-1">Team Collaboration Hub</p>
        </div>
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-150 ease-in-out"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold p-4 flex items-center text-gray-700"><FaUsers className="mr-2 text-purple-500" /> Team Members</h3>
          <ul className="px-2">
            {members.map((member) => (
              <li key={member.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition duration-150 ease-in-out">
                <div className="relative">
                  <img src={member.profile_pic} alt={member.name} className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200" />
                </div>
                <span className="font-medium text-gray-800">{member.fullname}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="lg:hidden mr-4 text-gray-600">
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <img src={team.profile_pic} alt={team.name} className="w-12 h-12 rounded-full mr-4 border-2 border-purple-200" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{team.name}</h2>
              <p className="text-sm text-green-500 font-medium">Active now</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition duration-150 ease-in-out">
              <FaPhoneAlt className="text-purple-500" />
            </button>
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition duration-150 ease-in-out">
              <FaVideo className="text-purple-500" />
            </button>
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition duration-150 ease-in-out">
              <FaEllipsisV />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender.id === userId ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`flex items-end ${message.sender.id === userId ? 'flex-row-reverse' : 'flex-row'}`}
                onClick={() => handleMessageClick(message.id)}
              >
                {message.sender.id !== userId && (
                  <img src={message.sender.profile_pic} alt={message.sender.fullname} className="w-8 h-8 rounded-full mr-2" />
                )}
                <div className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${message.sender.id === userId ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white rounded-bl-none'}`}>
                  <p>{message.message}</p>
                  {selectedMessageId === message.id && (
                    <span className={`text-xs ${message.sender.id === userId ? 'text-purple-200' : 'text-gray-500'} mt-1 block`}>
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t">
          <form onSubmit={handleSendMessage} className="flex items-center bg-gray-100 rounded-full p-2">
            <button type="button" className="text-gray-500 hover:text-gray-700 mx-2">
              <FaPaperclip />
            </button>
            <input
              type="text"
              className="flex-1 bg-transparent px-4 py-2 text-gray-700 focus:outline-none"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="button" className="text-gray-500 hover:text-gray-700 mx-2">
              <FaSmile />
            </button>
            <button type="submit" className="text-white bg-purple-600 rounded-full p-2 hover:bg-purple-700 transition duration-150 ease-in-out">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;