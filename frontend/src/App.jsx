import './App.css'
import SignUp from './components/User/SignUp'
import SignIn from './components/User/SignIn'
import Authentication from './pages/User/Authentication'
import HomePage from './pages/User/HomePage'

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
function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/signup',
      element: <Authentication><SignUp /></Authentication>
    },
    {
      path: '/signin',
      element: <Authentication><SignIn /></Authentication>
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
      path:'/admin-login',
      element:<AdminLogin />
    },
    {
      path:'/admin/dashboard',
      element:<AdminHome />
    },
    {
      path: '/admin/user-management',
      element:<UserManagemment />
    },
    {
      path: '/admin/skills',
      element: <Skills />
    },
    {
      path: '/admin/tags',
      element: <Tags />
    }
  ])

  return (
    <>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
        
    </Provider>
      
    </>
  )
}

export default App
