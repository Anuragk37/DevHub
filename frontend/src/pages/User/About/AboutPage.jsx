import React from 'react';
import { FaCode, FaUsers, FaComments, FaRocket, FaSearch, FaVideo } from 'react-icons/fa';

const AboutPage = () => {
  const features = [
    { icon: <FaCode />, title: 'Article Sharing', desc: 'Share your insights and learn from others' },
    { icon: <FaUsers />, title: 'Community Building', desc: 'Create and join thriving developer communities' },
    { icon: <FaComments />, title: 'Real-time Collaboration', desc: 'Chat, discuss, and solve problems together' },
    { icon: <FaRocket />, title: 'Project Management', desc: 'Organize teams and track project progress' },
    { icon: <FaSearch />, title: 'Smart Recommendations', desc: 'Discover content and connections tailored to you' },
    { icon: <FaVideo />, title: 'Video Conferencing', desc: 'Host virtual meetups and coding sessions' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="text-center mb-20">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
            About DevConnect
          </h1>
          <p className="mt-4 text-2xl text-gray-700 max-w-3xl mx-auto">
            Empowering developers to connect, collaborate, and innovate together.
          </p>
        </header>

        <section className="mb-24">
          <h2 className="text-4xl font-bold text-purple-900 mb-8 text-center">Our Vision</h2>
          <div className="bg-white rounded-2xl shadow-2xl p-10 transform hover:scale-105 transition duration-300">
            <p className="text-gray-700 text-lg leading-relaxed">
              At DevConnect, we're creating more than just a platform; we're building a thriving ecosystem where developers of all levels can flourish. Our mission is to break down barriers in the tech world, fostering an environment where knowledge flows freely, communities grow organically, and groundbreaking projects come to life. Whether you're a coding veteran or just starting your journey, DevConnect is your springboard to new heights in the ever-evolving world of technology.
            </p>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-4xl font-bold text-purple-900 mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-6 text-purple-600">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-purple-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-4xl font-bold text-purple-900 mb-12 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { number: '10k+', label: 'Active Users' },
              { number: '500+', label: 'Projects Launched' },
              { number: '1M+', label: 'Lines of Code Shared' },
            ].map((stat, index) => (
              <div key={index} className="bg-purple-600 rounded-xl shadow-xl p-8 text-center text-white">
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-xl">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-4xl font-bold text-purple-900 mb-8">Join Our Community</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Ready to be part of something extraordinary? Join DevConnect today and start your journey towards collaborative innovation and personal growth.
          </p>
          <a 
            href="mailto:contact@devconnect.com"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xl font-bold py-4 px-10 rounded-full hover:from-purple-700 hover:to-indigo-700 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </a>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;