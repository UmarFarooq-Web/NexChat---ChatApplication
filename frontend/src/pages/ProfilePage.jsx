import React from 'react'
import avatar from "../assets/images.png"
import './ProfilePage.css'
import useAuthStore from '../stores/auth.store'
const ProfilePage = () => {
  const { AuthUser } = useAuthStore()
  return (
    <div className=' profilePageContainer w-full'>
      <div className='InnerContainer'>
        <div className='ProfilePicSection'>
          <img src={AuthUser.ProfilePic == "" ? avatar : AuthUser.ProfilePic} alt="" />
        </div>
        <div className="profilePicText">Profile Pic</div>
        <div className='NameSection'><span>Name:</span><span>{AuthUser.FullName}</span></div>
        <div className='NameSection'><span>Username:</span><span>{AuthUser.Username}</span></div>
        <div className='NameSection'><span>Email:</span><span>{AuthUser.Email}</span></div>
      </div>
    </div>
  )
}

export default ProfilePage