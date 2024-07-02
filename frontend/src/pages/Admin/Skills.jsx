import React, { useState,useEffect } from 'react'
import Headers from '../../components/Admin/Header'
import SideBar from '../../components/Admin/SideBar'
import Tables from '../../components/Admin/Tags & skills/Table'
import Add from '../../components/Admin/Tags & skills/Add'
import axios from 'axios'

const Skills = () => {
   const[skills,setSkills] = useState([])
   const[error,setError] = useState('')

   const getSkills = async () => {
      try{
         const response = await axios.get('http://127.0.0.1:8000/api/admin/skills/')
         setSkills(response.data)
      }catch(error){
         console.log(error)
      }
   }

   useEffect(() => {
      getSkills()
   },[])

   const addSkill = async (name) => {
      try{
         const response = await axios.post('http://127.0.0.1:8000/api/admin/skills/',{
            name:name
         })
         setError('')
         setSkills([...skills,response.data])
      }catch(error){
         if(error.response){
            setError(error.response.data.message)
         }else{
            console.log("some thing happended");
         }
      }

   }

   const deleteSkill = async (id) => {
      try{
         await axios.delete(`http://127.0.0.1:8000/api/admin/skills/${id}/`)
         setSkills(skills.filter(skill => skill.id !== id))
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
            <Tables list={skills} onDelete={deleteSkill}/>
          </div>
          <div className='w-2/5 h-64 '>
            <Add add={addSkill} error={error}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Skills
