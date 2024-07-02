import React, { useEffect,useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../../components/Admin/Header';
import SideBar from '../../../components/Admin/SideBar';
import axiosInstance from '../../../utils/axiosInstance';
import { Link } from 'react-router-dom';

const ReportedArticle = (props) => {
  const [reports, setReports] = useState([]);

  const location = useLocation();
  const article = location.state;
  

  const getReports = async () => {
    try {
      const response = await axiosInstance.get(`/article/report-article/${article.id}`);
      console.log(response.data);
      setReports(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getReports();
  }, []);


  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <SideBar />
      <div className="flex justify-center sm:mx-5 md:ml-64 mt-4 px-4">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-4">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#0B304D]"><Link to={`/admin/view-article/${article.id}`}>{article.title}</Link></h2>
              <p className="text-gray-600 mt-2"><span className="font-semibold">Author:</span> {article.auther.fullname}</p>
              <p className="text-gray-600"><span className="font-semibold">Created Date:</span> {article.createdDate}</p>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
              <p className="text-gray-600 text-lg"><span className="font-semibold">Reports:</span> {article.reports}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr>
                  <th className="bg-[#0B304D] text-white px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Sl No</th>
                  <th className="bg-[#0B304D] text-white px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Reporter</th>
                  <th className="bg-[#0B304D] text-white px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Reason</th>
                  <th className="bg-[#0B304D] text-white px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report, index) => (
                  <tr key={report.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.user.fullname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.reported_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportedArticle;
