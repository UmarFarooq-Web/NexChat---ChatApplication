import { useEffect, useState } from 'react'
import {Toaster} from "react-hot-toast"
import './App.css'
import HomePage from './pages/HomePage'
import {BrowserRouter , Routes , Route, Navigate} from "react-router-dom"
import HomeLayout from './pages/HomeLayout'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import useAuthStore from './stores/auth.store'
import AuthInstance from './lib/Auth.Axios'

function App() {
  const {AuthUser , setAuthUser} = useAuthStore();

  useEffect(()=>{
    const fun = async()=>{

      try{
        const res = await AuthInstance.get("/check"); 
        setAuthUser(res.data);
        // console.log(AuthUser);
      }catch(error){
       console.log(error) 
      }
    }

    fun();
  } , [])

  return (
    <>
    <BrowserRouter>
    <Routes>

    <Route path='/login' element={AuthUser?<Navigate to={"/home"} />:<LoginPage/>} />
    <Route path='/signup' element={AuthUser?<Navigate to={"/home"} />:<SignupPage/>} />
    <Route path='/' element={<Navigate to={"/home"} />} />
    <Route path='/home' element={ AuthUser? <HomeLayout/>: <Navigate to={"/login"} />} >
      <Route index element={<HomePage/>}/>
      <Route path='/home/profile' element={<ProfilePage/>}/>
      <Route path='/home/settings' element={<SettingsPage/>} />
    </Route>

    </Routes>
    </BrowserRouter>
    <Toaster/>
    </>
  )
}

export default App
