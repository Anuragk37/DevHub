import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'


const TagSelector = ({onClose,fromProfile = false}) => {
   const[tags,setTags] = useState([])
   const[filteredTags,setFilteredTags] = useState([])
   const[selectedTags,setSelectedTags] = useState([])
   const[searchTerm,setSearchTerm] = useState('')

   const navigate = useNavigate()

   const accessToken = useSelector((state) => state.auth.userAccessToken)

   const getTags = async () =>{
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

   useEffect(() => {
      setFilteredTags(
         tags.filter(tag =>
            tag.name.toLowerCase().includes(searchTerm.toLowerCase())
         )
      )
   },[searchTerm,tags])

   const handleTagSelect = (tag) =>{
      if(!selectedTags.includes(tag)){
         setSelectedTags([...selectedTags,tag])
      }
   }

   const handleTagRemove = (tag) => {
      setSelectedTags(selectedTags.filter(t => t !==tag))
   }

   const handleSubmit = async () =>{
      console.log("clicked")
      try{
         console.log(accessToken)
         const decodedToken = jwtDecode(accessToken);
         const user_id = decodedToken.user_id;
         const response = await axios.post("http://127.0.0.1:8000/api/account/user-tag/",{
            user_id,
            selectedTags
         })

         if(fromProfile){
            onClose();
            navigate('/user/profile') 
         }else{
            toast.success("Account create suscessfully, you can login")
            navigate('/')
         }

      }catch(error){
         console.log(error);
      }
   }

  return (
   <div className="w-full max-w-md mx-auto bg-white shadow-equel rounded-2xl shadow-purple-100 p-3">
      <Link to={"/"}><h1 className='text-end'>skip now</h1></Link>
   <div className="container mx-auto p-4 max-w-xl">
   <h1 className="text-2xl text-center font-bold text-purple-900 mb-4">Select Your Intrests</h1>
     <div className="mb-4">
       <input
         type="text"
         placeholder="Search for tags..."
         className="shadow shadow-purple-200 appearance-none border rounded-3xl w-full py-2 px-3 text-placeholder text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
         value={searchTerm}
         onChange={e => setSearchTerm(e.target.value)}
       />
     </div>
     {selectedTags.length > 0 && (
        <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">Selected Skills:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <div
              key={tag.id}
              className="bg-purple-800 text-sm text-white p-1 px-2 m-1 rounded-full flex items-center space-x-2"
            >
              <span>{tag.name}</span>
              <button
                className=" text-white text-md "
                onClick={() => handleTagRemove(tag)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
     )}
     <div className="mb-4 max-h-60 overflow-y-auto  rounded">
       <div className="p-2 flex flex-wrap gap-2">
         {filteredTags.map(tag => (
           <div
             key={tag.id}
             className="cursor-pointer p-1 px-2 bg-purple-500 text-sm text-white rounded-full hover:bg-purple-900"
             onClick={() => handleTagSelect(tag)}
           >
             {tag.name}
           </div>
         ))}
       </div>
     </div>
     
     <button
       className="bg-purple-900 text-white p-1 rounded w-1/4 hover:bg-purple-950 transition duration-200"
       onClick={handleSubmit}
     >
       Submit
     </button>
   </div>
 </div>
  )
}

export default TagSelector
