import React from 'react'
import logo from "../assets/logo.png"
import "./NoChatBox.css"
const NoChatBox = () => {
  return (
    <div className='NoChatBoxContainer'>
        <div className="NoChatBoxInnerContainer">
            <div className="logo animate-bounce"><img src={logo} alt="" /></div>
            <h1>Welcome to NexChat!</h1>
            <p>NexChat is a next-generation real-time messaging app built for speed, simplicity, and seamless connection. Whether you're chatting with friends or collaborating with a team, NexChat keeps your conversations flowing — fast, responsive, and always in sync</p>
        </div>
    </div>
  )
}

export default NoChatBox