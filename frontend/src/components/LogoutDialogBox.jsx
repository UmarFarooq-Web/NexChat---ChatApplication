import React from 'react'
import "./LogoutDialogBox.css"
const LogoutDialogBox = () => {
  return (
    <div className='LogoutDialogBoxContainer'> 
    <div>Are You sure you want to Logout?</div>
    <div>
        <button>No</button>
        <button>Yes</button>
    </div>
    </div>
  )
}

export default LogoutDialogBox