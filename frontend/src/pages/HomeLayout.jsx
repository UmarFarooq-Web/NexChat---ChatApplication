import React from 'react'
import LeftSideBar from '../components/LeftSideBar'
import { Outlet } from 'react-router-dom'
const HomeLayout = () => {
  return (
    <div style={{ display: 'flex' , position:'relative' }}>

      <LeftSideBar />
      <Outlet />
    </div>
  )
}

export default HomeLayout