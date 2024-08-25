import React, { useState, useEffect } from 'react';
import Headers from '../../components/Admin/Header';
import SideBar from '../../components/Admin/SideBar';
import Table from '../../components/Admin/Tags & skills/Table';
import Add from '../../components/Admin/Tags & skills/Add';
import axiosInstance from '../../utils/axiosInstance';

const Tags = () => {
   const [tags, setTags] = useState([]);
   const [error, setError] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);

   const getTags = async (page = 1) => {
      try {
         const response = await axiosInstance.get(`/admin/tags/?page=${page}`);
         setTags(response.data.results);
         setCurrentPage(page);
         setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      getTags();
   }, []);

   const addTag = async (name) => {
      try {
         const response = await axiosInstance.post('/admin/tags/', {
            name: name
         });
         setTags(prevTags => [response.data, ...prevTags.slice(0, 9)]); // Add to start, maintain 10 items
         setError('');
      } catch (error) {
         if (error.response) {
            setError(error.response.data.message);
         } else {
            console.log("Something happened");
         }
      }
   };

   const deleteTag = async (id) => {
      try {
         await axiosInstance.delete(`/admin/tags/${id}/`);
         setTags(tags.filter(tag => tag.id !== id));
         if (tags.length === 1 && currentPage > 1) {
            getTags(currentPage - 1);
         } else {
            getTags(currentPage);
         }
      } catch (error) {
         console.log(error);
      }
   };

   const handlePageChange = (newPage) => {
      getTags(newPage);
   };

   return (
      <div className="w-screen min-h-screen max-h-full flex bg-gray-100">
         <div className="w-64">
            <SideBar />
         </div>
         
         <div className="flex-1 flex flex-col">
            <div className="w-screen md:w-full">
               <Headers />
            </div>
            
            <div className="flex flex-col lg:flex-row p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8">
               <div className='w-full lg:w-3/5 order-2 lg:order-1'>
                  <Table 
                     list={tags} 
                     onDelete={deleteTag}
                     currentPage={currentPage}
                     totalPages={totalPages}
                     onPageChange={handlePageChange}
                  />
               </div>
               <div className='w-full lg:w-2/5 order-1 lg:order-2'>
                  <Add add={addTag} error={error}/>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Tags;