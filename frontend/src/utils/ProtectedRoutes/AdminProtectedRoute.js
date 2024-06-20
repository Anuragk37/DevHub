import React,{useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminProtectedRoute = ({children}) => {
   const isAdminAuthenticated = useSelector((state) => state.auth.isAdminAuthenticated)
   const navigate = useNavigate()

   useEffect(() => {
      if(!isAdminAuthenticated){
         navigate('/admin-login')
      }
   },[isAdminAuthenticated])

  return children
}

export default AdminProtectedRoute
