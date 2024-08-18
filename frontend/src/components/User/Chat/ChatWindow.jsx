// ChatWindow.js
import React, { useEffect, useRef } from 'react';
import { FaPaperclip, FaPaperPlane, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const ChatWindow = ({ team, messages, handleSendMessage, newMessage, setNewMessage, selectedMessageId, handleMessageClick, messageContainerRef, handleDeleteMessage }) => {
  const accessToken = useSelector(state => state.auth.userAccessToken);
  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const userId = decodedToken ? decodedToken.user_id : null;

  const textareaRef = useRef(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTextareaChange = (e) => {
    setNewMessage(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

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
                <img src={message.sender.profile_pic} alt={message.sender.fullname} className="w-8 h-8 rounded-full mr-2 flex-shrink-0" />
              )}
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md ${message.sender.id === userId ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white rounded-bl-none'}`}>
                <div className="break-words whitespace-pre-wrap">
                  {message.message}
                </div>
                {selectedMessageId === message.id && (
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs ${message.sender.id === userId ? 'text-purple-200' : 'text-gray-500'}`}>
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                    {message.sender.id === userId && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message.id);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 ml-2"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex items-center bg-gray-100 rounded-lg p-2">
          <button type="button" className="text-gray-500 hover:text-gray-700 mx-2 flex-shrink-0">
            <FaPaperclip />
          </button>
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent px-4 py-2 text-gray-700 focus:outline-none resize-none overflow-hidden"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleTextareaChange}
            rows={1}
            style={{ maxHeight: '100px' }}
          />
          <button type="submit" className="text-purple-500 hover:text-purple-700 mx-2 flex-shrink-0">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;