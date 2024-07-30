// ChatPage.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import WS_URL from '../../../utils/BaseUrls';
import useWebSocket from 'react-use-websocket';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import DetailSideBar from '../../../components/User/Chat/DetailSideBar';
import ChatWindow from '../../../components/User/Chat/ChatWindow';


const CommunityChat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messageContainerRef = useRef(null);

  const location = useLocation();
  const community = location.state?.community;

  const accessToken = useSelector(state => state.auth.userAccessToken);
  const decodedToken = accessToken ? jwtDecode(accessToken) : null;
  const userId = decodedToken ? decodedToken.user_id : null;

  const { sendMessage, lastMessage, readyState } = useWebSocket(`${WS_URL}/communitychat/${community?.id}/?token=${accessToken}`);

  useEffect(() => {
    if (lastMessage !== null) {
      const messageData = JSON.parse(lastMessage.data);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    }
  }, [lastMessage]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axiosInstance.get(`notification_chat/communitychat/${community?.id}/`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
    getMessages();
  }, [community?.id]);

  useEffect(() => {
    if (community?.id) {
      axiosInstance.get(`/community/community-members/${community.id}/`)
        .then(response => {
         const memberList = response.data.map(data => data.user);

         console.log("memberList",memberList);
         setMembers(memberList);
        })
        .catch(error => {
          console.error('Error fetching team members:', error);
        });
    }
  }, [community?.id]);

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

  if (!community) {
    return <div>No team data available. Please go back and select a team.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 p-4 space-y-4 lg:space-y-0 lg:space-x-4">
      <DetailSideBar 
        team={community}
        members={members}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ChatWindow
        team={community}
        messages={messages}
        handleSendMessage={handleSendMessage}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        selectedMessageId={selectedMessageId}
        handleMessageClick={handleMessageClick}
        messageContainerRef={messageContainerRef}
      />
    </div>
  );
};

export default CommunityChat;
