import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserReverseRoute = ({children}) => {
  const isAuthenticated = useSelector((state)=>state.auth.isUserAuthenticated)
  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated){
      navigate('/')
    }
  },[isAuthenticated])
  return children
}

export default UserReverseRoute
