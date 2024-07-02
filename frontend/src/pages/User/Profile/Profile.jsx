import React, { useState } from 'react'
import Header from '../../../components/User/Header'
import ProfileDetails from '../../../components/User/Profile/ProfileDetails'
import About from '../../../components/User/Profile/About'
import MyArticle from '../../../components/User/Profile/MyArticle'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('about')

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className='h-full min-h-screen'>
      <Header />
      <div className='w-full px-4 sm:px-8 md:px-12 lg:px-40 py-7 mt-16 flex flex-col md:flex-row'>
        <ProfileDetails />
        <div className='bg-white shadow-equel h-full min-h-[80vh] sm:w-full md:w-3/4 lg:w-8/12 sm:mt-3 md:mt-0 md:ml-4 rounded-xl p-6'>
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
            <button
              className={`mr-4 py-2 px-6 ${activeTab === 'saved_articles' ? 'font-bold bg-purple-800 text-white' : ''}`}
              onClick={() => handleTabClick('saved_articles')}
            >
              Saved
            </button>
            
          </nav>
          {activeTab === 'about' && <About />}
          {activeTab === 'posts' && <MyArticle />}
          {activeTab === 'saved_articles' && <MyArticle fromSaved={true}/>}
        </div>
      </div>
    </div>
  )
}

export default Profile
