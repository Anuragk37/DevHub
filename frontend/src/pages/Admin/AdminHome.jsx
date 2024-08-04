import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axiosInstance from '../../utils/axiosInstance';
import SideBar from '../../components/Admin/SideBar';
import Header from '../../components/Admin/Header';
import { FaUsers, FaNewspaper, FaComments, FaUserFriends } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminHome = () => {
  const [stats, setStats] = useState({});
  const [userChartData, setUserChartData] = useState({
    labels: [],
    datasets: []
  });
  const [articleChartData, setArticleChartData] = useState({
    labels: [],
    datasets: []
  });

  const getData = async () => {
    try {
      const response = await axiosInstance.get('/admin/');
      setStats(response.data);
      console.log(response.data);
      
      formatChartData(response.data.users_by_date, response.data.articles_by_date);
    } catch (error) {
      console.error(error);
    }
  };

  const formatChartData = (usersData, articlesData) => {
    if (!usersData || !articlesData || usersData.length === 0 || articlesData.length === 0) {
      console.log('No data available for charts');
      return;
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const dates = usersData.map(item => formatDate(item.date));
    const userCounts = usersData.map(item => item.count);
    const articleCounts = articlesData.map(item => item.count);

    setUserChartData({
      labels: dates,
      datasets: [{
        label: 'Users',
        data: userCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    });

    setArticleChartData({
      labels: dates,
      datasets: [{
        label: 'Articles',
        data: articleCounts,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }]
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='w-screen min-h-screen max-h-full bg-gray-100'>
      <Header />
      <SideBar />
      <div className="flex flex-col sm:mx-5 md:ml-64 mt-4 px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<FaUsers />} title="Total Users" value={stats.user_count} />
          <StatCard icon={<FaNewspaper />} title="Articles Published" value={stats.article_count} />
          <StatCard icon={<FaComments />} title="Communities" value={stats.community_count} />
          <StatCard icon={<FaUserFriends />} title="Teams" value={stats.team_count} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecentActivity />
          <QuickActions />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="User Growth" data={userChartData} type="line" />
          <ChartCard title="Article Growth" data={articleChartData} type="bar" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="User Distribution" data={userChartData} type="pie" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className="text-3xl text-blue-600 mr-4">{icon}</div>
    <div>
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const RecentActivity = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
    <ul className="space-y-3">
      <li className="flex items-center text-sm text-gray-600">
        <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
        New user registered: John Doe
      </li>
      <li className="flex items-center text-sm text-gray-600">
        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
        Article published: "Getting Started with React"
      </li>
      <li className="flex items-center text-sm text-gray-600">
        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
        New community created: JavaScript Enthusiasts
      </li>
    </ul>
  </div>
);

const QuickActions = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 gap-4">
      <button className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-300">
        Add New User
      </button>
      <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300">
        Create Article
      </button>
      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
        Manage Communities
      </button>
      <button className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition duration-300">
        Review Reports
      </button>
    </div>
  </div>
);

const ChartCard = ({ title, data, type }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: type !== 'pie' ? {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Count',
        },
        min: 0,
      },
    } : {},
  };

  const chartComponent = {
    line: <Line options={options} data={data} />,
    bar: <Bar options={options} data={data} />,
    pie: <Pie options={options} data={data} />,
  }[type];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      {data && data.datasets ? (
        chartComponent
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default AdminHome;
