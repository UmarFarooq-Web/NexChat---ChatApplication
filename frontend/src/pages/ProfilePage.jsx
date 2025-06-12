import React from 'react'
import avatar from "../assets/images.png"
import './ProfilePage.css'
import useAuthStore from '../stores/auth.store'
import { Camera } from "lucide-react"
import { useState } from 'react'
import { MessageInstance } from '../lib/Auth.Axios'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const [PreviewImage, setPreviewImage] = useState(null);
  const [IsUploading, setIsUploading] = useState(false);
  const [Image, setImage] = useState(null);
  const { setAuthUser } = useAuthStore();
  const { AuthUser } = useAuthStore();

  const handleImageChange = async(e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select an image file")
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImage(reader.result);
    }

    reader.readAsDataURL(file)


    try {
      setIsUploading(true);
      const formdata = new FormData();
      formdata.append("Image", file);
      const res = await MessageInstance.post("/upload-profile", formdata, {
        headers: { "Content-Type": "multipart/form-data" }

      })
      toast.success("Profile Pictue Updated");

      setAuthUser(res.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unexpected Error");

    }finally{
      setIsUploading(false)

    }

  }
  return (
    <div className=' profilePageContainer w-full'>
      <div className='InnerContainer'>
        <div className='CameraContainer'>
          <div className='ProfilePicSection'>
            <img src={PreviewImage ? PreviewImage : AuthUser.ProfilePic == "" ? avatar : AuthUser.ProfilePic} alt="" />
          </div>
          <input className='hidden' id='camera' onChange={handleImageChange} type="file" />
          <label htmlFor='camera' className={`CameraIcon ${IsUploading ? "animate-pulse" : ""}`}><Camera /></label>
        </div>
        <div className="profilePicText">{IsUploading?"Uploading...":"Profile Pic"}</div>
        <div className='NameSection'><span>Name:</span><span>{AuthUser.FullName}</span></div>
        <div className='NameSection'><span>Username:</span><span>{AuthUser.Username}</span></div>
        <div className='NameSection'><span>Email:</span><span>{AuthUser.Email}</span></div>
      </div>
    </div>
  )
}

export default ProfilePage