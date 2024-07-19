import React, { useEffect, useState } from 'react';
import Header from '../../../components/User/Header';
import ProfileDetails from '../../../components/User/Profile/ProfileDetails';
import About from '../../../components/User/Profile/About';
import MyArticle from '../../../components/User/Profile/MyArticle';
import LoginModal from '../../../components/User/Profile/LoginModal';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isUserAuthenticated);

  const { id } = useParams();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleFollowUnfollow = async (setUserData) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const response = await axiosInstance.post(`/account/follow-unfollow/`, {
        following_id: id,
      });
      setUserData((prevData) => ({
        ...prevData,
        isFollowing: !prevData.isFollowing,
        followers: prevData.isFollowing ? prevData.followers - 1 : prevData.followers + 1,
      }));
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className='h-full min-h-screen'>
      <Header />
      <div className='w-full px-4 sm:px-8 md:px-12 lg:px-40 py-7 mt-16 flex flex-col md:flex-row'>
        <ProfileDetails isOwnProfile={false} userId={id} handleFollowUnfollow={handleFollowUnfollow} />
        <div className='bg-white shadow-equal h-full min-h-[80vh] sm:w-full md:w-3/4 lg:w-8/12 sm:mt-3 md:mt-0 md:ml-4 rounded-xl p-6'>
          <nav className='flex mb-4 border-b border-gray-200'>
            <button
              className={`mr-4 py-2 px-6 ${activeTab === 'about' ? 'font-bold bg-purple-800 text-white' : ''}`}
              onClick={() => handleTabClick('about')}
            >
              About
            </button>
            <button
              className={`mr-4 py-2 px-6 ${activeTab === 'posts' ? 'font-bold bg-purple-800 text-white' : ''}`}
              onClick={() => handleTabClick('posts')}
            >
              Posts
            </button>
          </nav>
          {activeTab === 'about' && <About isOwnProfile={false} userId={id} />}
          {activeTab === 'posts' && <MyArticle isOwnProfile={false} userId={id} />}
        </div>
      </div>
      {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />}
    </div>
  );
};

export default UserProfile;
