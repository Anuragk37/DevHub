import './App.css'
import SignUp from './components/User/SignUp'
import SignIn from './components/User/SignIn'
import Authentication from './pages/User/Authentication'
import HomePage from './pages/User/HomePage'

import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import AdminLogin from './pages/Admin/AdminLogin'

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
      path:'/admin-login',
      element:<AdminLogin />
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
