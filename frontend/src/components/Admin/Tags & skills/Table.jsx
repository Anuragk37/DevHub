import React, { useEffect,useState } from 'react'
const Table = ({list}) => {

  return (
   <div className="w-full h-full">
   <div className="relative overflow-x-auto shadow-lg sm:rounded-lg sm:w-full md:w-3/4">
     <table className="w-full text-sm text-left text-gray-500">
       <thead className="text-xs text-gray-700 uppercase bg-gray-200">
         <tr>
           <th scope="col" className="px-6 py-3">Sl No</th>
           <th scope="col" className="px-6 py-3">Sills</th>
           <th scope="col" className="px-6 py-3">Action</th>
           
         </tr>
       </thead>
       <tbody>
         {list.map((skill,index) => (
           <tr className="bg-white border-b hover:bg-gray-100" key={index}>
             <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
               {index+1}
             </th>
             <td className="px-6 py-4">{skill.name}</td>
             <td className="px-6 py-4">
               <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a>
             </td>
           </tr>
         ))}
       </tbody>
     </table>
   </div>
 </div>
  )
}

export default Table
