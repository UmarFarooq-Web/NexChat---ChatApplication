import React, { useEffect } from 'react'
import "./AddChatBox.css"
import { useState } from 'react'
import { MessageInstance } from '../lib/Auth.Axios';
import { LoaderCircle, X } from "lucide-react";
import logo from "../assets/logo.png"
import toast from "react-hot-toast"
import useAuthStore from '../stores/auth.store';


const AddChatBox = () => {

    const [debouncedText, setDebouncedText] = useState("");
    const [SearchText, setSearchText] = useState("");
    const [IsSearching, setIsSearching] = useState(false);
    const [showUser, setShowUser] = useState(false);
    const [data, setData] = useState([]);

    const { setIsAddChatBoxShown, Users, setUsers } = useAuthStore()



    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                if (!debouncedText) return
                setIsSearching(true);
                setShowUser(false);

                const res = await MessageInstance.get(`/get-user/${debouncedText}`)
                console.log(res.data);


                setData(res.data);
                setShowUser(true);
            } catch (error) {
                toast.error(error.response?.data?.message || "Unexpected Error")
                console.log("error in useeffect in addchatbox : ", error)
            } finally {
                setIsSearching(false)
            }
        }, 800);

        return () => {
            clearTimeout(timer)
        }
    }, [debouncedText])


    const handleChange = (e) => {
        setDebouncedText(e.target.value);
    }


    const handleAddUser = async (e) => {
        const UserId = e.target.name;

        try {
            const res = await MessageInstance.get(`/add-user/${UserId}`)
            toast.success(res.data.message);

            setUsers([...Users, res.data.User])



        } catch (error) {
            toast.error(error.response?.data?.message || "Unexpected error")
        }

    }
    return (
        <div className='AddChatBoxContainer'>
            <span className='CloseBtn' onClick={() => setIsAddChatBoxShown(false)}><X /></span>
            <h1>New Chat</h1>
            <div className="textInputDiv">
                <input type="text" id='TextInput' onChange={handleChange} value={debouncedText} className='TextInput' placeholder='Search Here' />
                <label htmlFor="TextInput" className='TextInputLable'>Search Here</label>
            </div>
            <div className="result">
                {IsSearching && <LoaderCircle className="animate-spin" />}
                {showUser && data.map((e, i) => (
                    <div key={i} className='SearchUserCard'>
                        <div className='w-[70px]'><img src={e.ProfilePic} alt="" /></div>
                        <div className='grow'>
                            <div className="SearchUserTitle">{e.FullName}</div>
                            <p>{e.Username}</p>
                        </div>
                        <div><button name={e._id} onClick={handleAddUser} className='SearchUserAddButton'>Add</button></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AddChatBox