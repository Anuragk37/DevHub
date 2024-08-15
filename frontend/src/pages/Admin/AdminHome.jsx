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
import { FaUsers, FaNewspaper, FaComments, FaUserFriends, FaCalendarAlt } from 'react-icons/fa';

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
  const [userChartData, setUserChartData] = useState({});
  const [articleChartData, setArticleChartData] = useState({});
  const [userDistributionData, setUserDistributionData] = useState({});
  const [userTimePeriod, setUserTimePeriod] = useState('month');
  const [articleTimePeriod, setArticleTimePeriod] = useState('month');

  useEffect(() => {
    fetchData(userTimePeriod, 'users');
    fetchData(articleTimePeriod, 'articles');
  }, [userTimePeriod, articleTimePeriod]);

  const fetchData = async (period, dataType) => {
    try {
      const response = await axiosInstance.get(`/admin/?period=${period}&dataType=${dataType}`);
      if (dataType === 'users') {
        setStats(prevStats => ({ ...prevStats, ...response.data }));
        formatUserChartData(response.data);
      } else if (dataType === 'articles') {
        setStats(prevStats => ({ ...prevStats, ...response.data }));
        formatArticleChartData(response.data);
      }
      formatUserDistributionData(response.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatUserChartData = (data) => {
    const userLabels = data.users_by_date.map(item => formatDate(item.date));
    const userCounts = data.users_by_date.map(item => item.count);
    setUserChartData({
      labels: userLabels,
      datasets: [{
        label: 'New Users',
        data: userCounts,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }]
    });
  };

  const formatArticleChartData = (data) => {
    const articleLabels = data.articles_by_date.map(item => formatDate(item.date));
    const articleCounts = data.articles_by_date.map(item => item.count);
    setArticleChartData({
      labels: articleLabels,
      datasets: [{
        label: 'New Articles',
        data: articleCounts,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }]
    });
  };

  const formatUserDistributionData = (data) => {
    setUserDistributionData({
      labels: ['Users', 'Articles', 'Communities', 'Teams'],
      datasets: [{
        data: [data.user_count, data.article_count, data.community_count, data.team_count],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(54, 162, 235, 0.8)',
        ],
      }]
    });
  };

  const handlePeriodChange = (period, dataType) => {
    if (dataType === 'users') {
      setUserTimePeriod(period);
    } else if (dataType === 'articles') {
      setArticleTimePeriod(period);
    }
  };

  return (
    <div className='w-screen min-h-screen max-h-full bg-gray-100'>
      <Header />
      <SideBar />
      <div className="flex flex-col sm:mx-5 md:ml-64 mt-4 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaUsers />} title="Total Users" value={stats.user_count} color="bg-blue-500" />
          <StatCard icon={<FaNewspaper />} title="Articles Published" value={stats.article_count} color="bg-green-500" />
          <StatCard icon={<FaComments />} title="Communities" value={stats.community_count} color="bg-yellow-500" />
          <StatCard icon={<FaUserFriends />} title="Teams" value={stats.team_count} color="bg-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard 
            title="User Growth" 
            data={userChartData} 
            type="line" 
            period={userTimePeriod}
            onPeriodChange={(period) => handlePeriodChange(period, 'users')}
          />
          <ChartCard 
            title="Article Growth" 
            data={articleChartData} 
            type="line" 
            period={articleTimePeriod}
            onPeriodChange={(period) => handlePeriodChange(period, 'articles')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard title="User Distribution" data={userDistributionData} type="pie" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`${color} rounded-lg shadow-lg p-6 flex items-center justify-between`}>
    <div className="text-3xl text-white mr-4">{icon}</div>
    <div className="text-right">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, data, type, period, onPeriodChange }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 18,
          weight: 'bold',
        },
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {onPeriodChange && (
          <div className="flex items-center">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <select
              value={period}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="border rounded p-2 text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        )}
      </div>
      {data && data.datasets ? (
        chartComponent
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default AdminHome;