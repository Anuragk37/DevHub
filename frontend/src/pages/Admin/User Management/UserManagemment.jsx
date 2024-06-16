import React,{useState,useEffect} from 'react'
import Header from '../../../components/Admin/Header'
import SideBar from '../../../components/Admin/SideBar'
import axios from 'axios'
import authSlice from '../../../features/authSlice'

const UserManagemment = () => {
   const [users,setUsers] = useState([])

   const getUsers = async ()=>{
      try{
         const response = await axios.get('http://127.0.0.1:8000/api/account/user/')
         console.log(response.data);
         setUsers(response.data)
      }catch(error){
         console.log(error);
      }
   }

   useEffect(()=>{
      getUsers()
   },[])

  return (
   <div>
      <Header />
      <SideBar />
      <div className="flex justify-center  min-h-full sm:mx-5 md:ml-64 mt-4">
        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg sm:w-full md:w-3/4">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">sl no</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">email</th>
                <th scope="col" className="px-6 py-3">Phone</th>
                <th scope="col" className="px-6 py-3">Date Joined</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user,index)=> (
                <tr className="bg-white border-b hover:bg-gray-100" key={index}>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{index+1}</th>
                  <td className="px-6 py-4">{user.fullname}</td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone_number}</td>
                  <td className="px-6 py-4">{user.date_joined}</td>
                  <td className="px-6 py-4">
                    <a href="#" className="font-medium text-blue-600 hover:underline">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserManagemment
