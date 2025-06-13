import React, { useState } from 'react'
import "./HomePage.css";
import { X, Plus, PanelLeftOpen, Search, Pin, LoaderCircle } from "lucide-react"
import logo from "../assets/logo.png"
import ChatBox from '../components/chatBox';
import { useEffect } from 'react';
import useAuthStore from '../stores/auth.store';
import { MessageInstance } from '../lib/Auth.Axios';
import AddChatBox from '../components/AddChatBox';
import message from '../../../backend/src/models/message.model';
import socket from '../lib/socket.io';
import avatar from "../assets/images.png"
import NoChatBox from '../components/NoChatBox';


const HomePage = () => {
  const [show, setShow] = useState(false);
  const [IsUsersLoading, setIsUsersLoading] = useState(false);
  const { AuthUser, Messages, setMessages, setSelectedUser, connectedUsers } = useAuthStore();
  const setConnectedUsers = useAuthStore((state) => state.setConnectedUsers);
  const [filteredUser , setFilterUsers] = useState([]);
  const [searchText , setSearchText] = useState("")

  const { IsAddChatBoxShown, setIsAddChatBoxShown, Users, setUsers, SelectedUser } = useAuthStore()
  const reloadKey = useAuthStore();

  useEffect(() => {
    const fun = async () => {
      try {
        socket.connect();
        socket.emit('join', AuthUser._id)
        setIsUsersLoading(true)
        const res = await MessageInstance.get(`/get-users`);
        setUsers(res.data);

        const setConnectedUsers = useAuthStore.getState().setConnectedUsers;

        socket.on("room-users", (e) => {
          setConnectedUsers((prev) => {
            const newUsers = e.filter((user) => !prev.includes(user));
            return [...prev, ...newUsers];
          });
        })

        socket.on("user-connected", (user) => {
          console.log("User Connected : ", user);
          setConnectedUsers((prev) => {
            if (!prev.includes(user)) {
              return [...prev, user];
            }
            return prev;
          })
        });

        console.log(connectedUsers)



        socket.on("user-disconnected", (user) => {
          setConnectedUsers((prev) => prev.filter((u) => u !== user));
        })


      } catch (error) {
        console.log("Error in useEffect in homePage.jsx : ", error);
      } finally {
        setIsUsersLoading(false);
      }
    }


    fun();
  }, [])

  useEffect(() => {
    if(!Users) return
    
    const filter = Users.filter((u)=>(
      u.FullName.toLowerCase().includes(searchText.toLowerCase())
    ))
   
    setFilterUsers(filter)

  }, [Users , searchText])
  

  const handleUserCardClick = async (UserId) => {

    try {
      const res = await MessageInstance.get(`/get-messages/${UserId}`);
      // console.log(UserId);
      setMessages(res.data);

    } catch (error) {

    }
  }

  const handleChange = (e)=>{
    setSearchText(e.target.value);
  }

  return (
    <div className="containers">
      <button className='chatShow' onClick={() => setShow(true)}><PanelLeftOpen /></button>

      <div className={`left ${show ? "show" : ""} `}>
        <div className='heading'>
          <div className='first'>Messages</div>
          <div className='flex second' onClick={() => { setIsAddChatBoxShown(!IsAddChatBoxShown) }}><Plus />New Chat</div>
        </div>
        <div className='searchBar'>
          <input type="text" placeholder='Search Message' onChange={handleChange} value={searchText} />
          <Search color='white' size={25} />
        </div>
        <div className="heading2">Pinned Message<Pin size={15} /></div>


        {IsUsersLoading ? <LoaderCircle className='animate-spin' /> : filteredUser.map((e, i) => (
          e.IsPinned &&
          <button key={i} name={e._id} onClick={() => { handleUserCardClick(e._id); setSelectedUser(e) }} className="userCard">
            <div className="profilePic">
              <img src={e.ProfilePic || avatar} alt="" />
            </div>
            <div className={`activeIcon ${connectedUsers.includes(e._id) ? "" : "hidden"}`}></div>
            <div className='dataDiv'>
              <div className="title"><span>{e.FullName}</span><span>2 min ago</span></div>
              <div className="Message"><span>{e.lastMessage}</span><span>1</span></div>
            </div>
          </button>))}

        <div className="heading2">All Messages</div>
        {IsUsersLoading ? <LoaderCircle className='animate-spin' /> : filteredUser.map((e, i) => (
          !e.IsPinned && (
            <button key={i} name={e._id} onClick={() => { handleUserCardClick(e._id); setSelectedUser(e) }} className={`userCard ${SelectedUser ? SelectedUser._id == e._id ? "bg-[#fafafa34]" : "" : ""}`}>
              <div className="profilePic">
                <img src={e.ProfilePic || avatar} alt="" />

              </div>
              <div className={`activeIcon ${connectedUsers.length==0?"": connectedUsers.includes(e._id) ? "" : "hidden"}`}></div>
              <div className='dataDiv'>
                <div className="title"><span>{e.FullName}</span><span className='hidden'></span></div>
                <div className="Message"><span>{e.lastMessage}</span></div>
              </div>
            </button>)))}
      </div>


      <div className="right">
        {SelectedUser ? <ChatBox /> : <NoChatBox />}
      </div>
      {show && <button className='chatClose' onClick={() => { setShow(false) }}><X size={30} /></button>}
      {IsAddChatBoxShown && <AddChatBox />}
    </div>

  )
}

export default HomePage