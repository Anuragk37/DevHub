import React , { useState,useEffect } from 'react'
import Headers from '../../components/Admin/Header'
import SideBar from '../../components/Admin/SideBar'
import Tables from '../../components/Admin/Tags & skills/Table'
import Add from '../../components/Admin/Tags & skills/Add'
import axios from 'axios'


const Tags = () => {
   const[tags,setTags] = useState([])

   const getTags = async () => {
      try{
         const response = await axios.get('http://127.0.0.1:8000/api/admin/tags/')
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
      }catch(error){
         console.log(error)
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
        <div className="flex overflow-y-auto  py-10 px-16">
          <div className='w-3/5 h-full'>
            <Tables list={tags} onDelete={deleteTag}/>
          </div>
          <div className='w-2/5 h-64 '>
            <Add add={addTag} tag={true}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tags
