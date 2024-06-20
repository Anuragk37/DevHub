import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
const UserProtecredRoute = ({children}) => {
   const isAuthenticated = useSelector((state) => state.auth.isUserAuthenticated)
   const navigate = useNavigate()

   useEffect(() => {
      if(!isAuthenticated){
         navigate('/signin')
      }
   },[isAuthenticated])
   
  return children
}

export default UserProtecredRoute
