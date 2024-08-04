import React, { useState, useEffect } from 'react'
import Headers from '../../components/Admin/Header'
import SideBar from '../../components/Admin/SideBar'
import Table from '../../components/Admin/Tags & skills/Table'
import Add from '../../components/Admin/Tags & skills/Add'
import axios from 'axios'

const Skills = () => {
   const [skills, setSkills] = useState([])
   const [error, setError] = useState('')

   const getSkills = async () => {
      try {
         const response = await axios.get('http://127.0.0.1:8000/api/admin/skills/')
         setSkills(response.data)
      } catch (error) {
         console.log(error)
      }
   }

   useEffect(() => {
      getSkills()
   }, [])

   const addSkill = async (name) => {
      try {
         const response = await axios.post('http://127.0.0.1:8000/api/admin/skills/', {
            name: name
         })
         setError('')
         setSkills([...skills, response.data])
      } catch (error) {
         if (error.response) {
            setError(error.response.data.message)
         } else {
            console.log("something happened");
         }
      }
   }

   const deleteSkill = async (id) => {
      try {
         await axios.delete(`http://127.0.0.1:8000/api/admin/skills/${id}/`)
         setSkills(skills.filter(skill => skill.id !== id))
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <div className="w-full min-h-screen bg-gray-100 flex flex-col lg:flex-row">
         <div className="w-full lg:w-64 lg:min-h-screen">
            <SideBar />
         </div>
         
         <div className="flex-1 flex flex-col">
            <div className="w-full">
               <Headers />
            </div>
            
            <div className="flex flex-col lg:flex-row p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8">
               <div className='w-full lg:w-3/5 order-2 lg:order-1'>
                  <Table list={skills} onDelete={deleteSkill}/>
               </div>
               <div className='w-full lg:w-2/5 order-1 lg:order-2'>
                  <Add add={addSkill} error={error}/>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Skills