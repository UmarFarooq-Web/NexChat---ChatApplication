import React, { useState, useEffect } from 'react'
import "./LeftSideBar.css";
import logo from "../assets/logo.png"
import { House, UserRoundPen, LogOut, X, Menu } from "lucide-react"
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../stores/auth.store';
import LogoutDialogBox from './LogoutDialogBox';
import AuthInstance from '../lib/Auth.Axios';
import toast from 'react-hot-toast';
import {Tooltip} from "react-tooltip";

const LeftSideBar = () => {
  const [active, setActive] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();
  const {setAuthUser} = useAuthStore();



  useEffect(() => {
    setActive(loc.pathname == '/' ? "/home" : loc.pathname)
  }, [loc.pathname])

  const handleLogout = async () => {
    try {
      const res = await AuthInstance.post("/logout");
      toast.success(res?.data?.message);
      setAuthUser(null);
      navigate("/login")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unexpected Error")
      console.log("Error in HanaleLogout function : ", error);
    }
  }


  return (
    <div className='outerContainer'>
      <button className="menuButton" onClick={() => { setShow(true) }}><Menu strokeWidth={1.5} size={30} /></button>
      <div className={`container ${show ? " open" : ""}`}>
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <div className="icons">
          <Link data-tooltip-id='home' data-tooltip-content="Home" to={"/home"} onClick={() => { setShow(false) }}>
            <div className={active == "/home" ? "selected" : ""}>
              <House color="#ffffff" strokeWidth={1.5} size={25} />
            <Tooltip id='home'/>

            </div>
          </Link>
          <Link data-tooltip-id='profile' data-tooltip-content="Profile" to={"/home/profile"} onClick={() => { setShow(false) }}>
            <div className={active == "/profile" ? "selected" : ""}>
              <UserRoundPen color="#ffffff" strokeWidth={1.5} size={25} />
            <Tooltip id='profile'/>
            </div>
          </Link>

          <div data-tooltip-id='logout' data-tooltip-content="Logout" className={active == "/settings" ? "selected" : ""} onClick={handleLogout}>
            <LogOut color="#ffffff" strokeWidth={1.5} size={25} />
            <Tooltip id='logout'/>
          </div>
        </div>
      </div>
      {show && <button className='closeButton' onClick={() => { setShow(false) }}><X size={30} /></button>}
    </div>
  )
}

export default LeftSideBar
