import React, { useState } from 'react';
import { FaPaperclip, FaSmile, FaPaperPlane, FaUsers, FaEllipsisV, FaSearch, FaVideo, FaPhoneAlt, FaBars, FaTimes } from 'react-icons/fa';

const ChatPage = () => {
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const team = {
    name: 'Development Team',
    profilePic: '/api/placeholder/150/150',
  };

  const messages = [
    { sender: 'Alice', senderAvatar: '/api/placeholder/150/150', text: 'Hello team!', time: '10:00 AM' },
    { sender: 'me', text: 'Hi Alice!', time: '10:02 AM' },
    { sender: 'Bob', senderAvatar: '/api/placeholder/150/150', text: 'Good morning everyone!', time: '10:05 AM' },
    { sender: 'me', text: 'Good morning Bob!', time: '10:06 AM' },
  ];

  const members = [
    { id: 1, name: 'Alice', avatar: '/api/placeholder/150/150', online: true },
    { id: 2, name: 'Bob', avatar: '/api/placeholder/150/150', online: false },
    { id: 3, name: 'Charlie', avatar: '/api/placeholder/150/150', online: true },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log('New message:', newMessage);
    setNewMessage('');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200" />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${member.online ? 'bg-green-500' : 'bg-gray-400'} border-2 border-white`}></span>
                </div>
                <span className="font-medium text-gray-800">{member.name}</span>
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
            <img src={team.profilePic} alt={team.name} className="w-12 h-12 rounded-full mr-4 border-2 border-purple-200" />
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end ${message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                {message.sender !== 'me' && (
                  <img src={message.senderAvatar} alt={message.sender} className="w-8 h-8 rounded-full mr-2" />
                )}
                <div className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${message.sender === 'me' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white rounded-bl-none'}`}>
                  <p>{message.text}</p>
                  <span className={`text-xs ${message.sender === 'me' ? 'text-purple-200' : 'text-gray-500'} mt-1 block`}>{message.time}</span>
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