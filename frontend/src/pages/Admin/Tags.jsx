import React , { useState,useEffect } from 'react'
import Headers from '../../components/Admin/Header'
import SideBar from '../../components/Admin/SideBar'
import Table from '../../components/Admin/Tags & skills/Table'
import Add from '../../components/Admin/Tags & skills/Add'
import axios from 'axios'


const Tags = () => {
   const[tags,setTags] = useState([])
   const[error,setError] = useState('')

   const getTags = async () => {
      try{
         const response = await axios.get('http://127.0.0.1:8000/api/admin/tags/')
         console.log(response.data);
         setTags(response.data)
      }catch(error){
         console.log(error)
      }
   }

   useEffect(() => {
      getTags()
   },[])

   const addTag = async (name) => {
      try{
         const response = await axios.post('http://127.0.0.1:8000/api/admin/tags/',{
            name:name
         })
         setTags([...tags,response.data])
         setError('')
      }catch(error){
         if(error.response){
            setError(error.response.data.message)
         }else{
            console.log("some thing happended");
         }
      }

   }

   const deleteTag = async (id) => {
      try{
         await axios.delete(`http://127.0.0.1:8000/api/admin/tags/${id}/`)
         setTags(tags.filter(tag => tag.id !== id))
      }catch(error){
         console.log(error)
      }
   }

  return (
   <div className="w-screen min-h-screen max-h-full flex bg-gray-100">
      <div className="w-64">
        <SideBar />
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="w-screen md:w-full">
          <Headers />
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8">
               <div className='w-full lg:w-3/5 order-2 lg:order-1'>
                  <Table list={tags} onDelete={deleteTag}/>
               </div>
               <div className='w-full lg:w-2/5 order-1 lg:order-2'>
                  <Add add={addTag} error={error}/>
               </div>
            </div>
      </div>
    </div>
  )
}

export default Tags
