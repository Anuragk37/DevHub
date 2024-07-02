import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   isUserAuthenticated: false,
   userAccessToken: null,
   userRefreshToken: null,
   isAdminAuthenticated: false,
   
};

const authSlice = createSlice({
   name:"auth",
   initialState,
   reducers:{
      userSignIn(state,action){
         state.isUserAuthenticated = true;
         state.userAccessToken = action.payload.accessToken;
         state.userRefreshToken = action.payload.refreshToken;
      },
      userSignOut(state){
         state.isUserAuthenticated = false;
         state.userAccessToken = null;
         state.userRefreshToken = null;
      },
      adminSignIn(state,action){
         state.isAdminAuthenticated = true;
         state.userAccessToken = action.payload.accessToken;
         state.adminRefreshToken = action.payload.refreshToken;
      },
      adminSignOut(state){
         state.isAdminAuthenticated = false;
         state.userAccessToken = null;
         state.adminRefreshToken = null;
      },
   }  
})

export const {userSignIn,userSignOut,adminSignIn,adminSignOut} = authSlice.actions
export default authSlice.reducer