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
    },
    {
      path:'/dashboard',
      element:<AdminHome />
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
