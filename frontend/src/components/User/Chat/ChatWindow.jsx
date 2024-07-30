// ChatWindow.js
import React, { useEffect, useRef, useCallback } from 'react';
import { FaPaperclip, FaSmile, FaPaperPlane,FaPhoneAlt,FaVideo  } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const ChatWindow = ({ team, messages, handleSendMessage, newMessage, setNewMessage, selectedMessageId, handleMessageClick, messageContainerRef }) => {
  const accessToken = useSelector(state => state.auth.userAccessToken);
  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const userId = decodedToken ? decodedToken.user_id : null;

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
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
  );
};

export default ChatWindow;
