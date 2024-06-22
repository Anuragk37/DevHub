import './App.css'
import SignUp from './components/User/SignUp'
import SignIn from './components/User/SignIn'
import Authentication from './pages/User/Authentication'
import HomePage from './pages/User/HomePage'
import OtpVerify from './components/User/OtpVerify'

import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import AdminLogin from './pages/Admin/AdminLogin'

import {Provider} from 'react-redux'
import {store,persistor} from './app/store'
import { PersistGate } from 'redux-persist/integration/react'
import AdminHome from './pages/Admin/AdminHome'
import UserManagemment from './pages/Admin/User Management/UserManagemment'
import Skills from './pages/Admin/Skills'
import Tags from './pages/Admin/Tags'
import SkillsSelector from './components/User/SkillSelector'
import TagSelector from './components/User/TagSelector'
import CreateArticle from './pages/User/Article/CreateArticle'
import ArticleView from './pages/User/Article/ArticleView'
import UserProtecredRoute from './utils/ProtectedRoutes/UserProtecredRoute'
import AdminProtectedRoute from './utils/ProtectedRoutes/AdminProtectedRoute'
import UserReverseRoute from './utils/ProtectedRoutes/UserReverseRoute'

import { Toaster } from 'react-hot-toast'
import Profile from './pages/User/Profile/Profile'
import { AddBio } from './components/User/Profile/AddBio'
function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/signup',
      element: <UserReverseRoute><Authentication><SignUp /></Authentication></UserReverseRoute>
    },
    {
      path: '/signin',
      element: <UserReverseRoute><Authentication><SignIn /></Authentication></UserReverseRoute>
    },
    {
      path: '/verify-otp',
      element:<Authentication><OtpVerify /></Authentication>
    },
    {
      path: '/skill-selection',
      element: <Authentication><SkillsSelector /></Authentication>
    },
    {
      path: '/tag-selection',
      element: <Authentication><TagSelector /></Authentication>
    },
    {
      path:'/user/create-article',
      element:<UserProtecredRoute><CreateArticle /></UserProtecredRoute>
    },
    {
      path:'/user/view-article/:id',
      element:<ArticleView />
    },
    {
      path:'/user/profile',
      element:<UserProtecredRoute><Profile /></UserProtecredRoute>
    },
    {
      path:'/user/add-bio',
      element:<UserProtecredRoute><AddBio /></UserProtecredRoute>
    },
    {
      path:'/admin-login',
      element:<AdminLogin />
    },
    {
      path:'/admin/dashboard',
      element:<AdminProtectedRoute><AdminHome /></AdminProtectedRoute>
    },
    {
      path: '/admin/user-management',
      element:<AdminProtectedRoute><UserManagemment /></AdminProtectedRoute>
    },
    {
      path: '/admin/skills',
      element: <AdminProtectedRoute><Skills /></AdminProtectedRoute>
    },
    {
      path: '/admin/tags',
      element: <AdminProtectedRoute><Tags /></AdminProtectedRoute>
    }
  ])

  return (
    <>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
          <Toaster
            position="bottom-center"
            reverseOrder={false}
          />
        </PersistGate>
        
    </Provider>
      
    </>
  )
}

export default App
