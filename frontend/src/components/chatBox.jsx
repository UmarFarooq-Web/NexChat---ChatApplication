import React, { useEffect, useRef } from 'react'
import './chatBox.css'
import logo from "../assets/logo.png"
import { Ellipsis, Smile, SendHorizontal, Image, X } from 'lucide-react'
import useAuthStore from '../stores/auth.store'
import { useState } from 'react'
import { MessageInstance } from "../lib/Auth.Axios.js"
import toast from "react-hot-toast"
import socket from '../lib/socket.io.js'
import avatar from "../assets/images.png"





const chatBox = () => {
    const { AuthUser, Messages, SelectedUser, setMessages , connectedUsers } = useAuthStore();
    const [image, setImage] = useState(null);
    const [PreviewImage, setPreviewImage] = useState("");
    const [message, setMessage] = useState("");
    const ChatContainerRef = useRef(null);
    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file.type.startsWith("image/")) {
            return toast.error("Please select an image file")
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setPreviewImage(reader.result);
        }

        reader.readAsDataURL(file)
        setImage(file);
    }


    const handleSubmit = async () => {
        if (!message && !image) return;

        try {

            socket.emit('send-message', { SenderId: AuthUser._id, ReceiverId: SelectedUser._id, Message: message ,PicturePath:PreviewImage  });
            setMessages([...Messages, { SenderId: AuthUser._id, ReceiverId: SelectedUser._id, Message: message , PicturePath:PreviewImage }])
            const m = message
            setMessage("");
            const formData = new FormData();
            formData.append("Image", image);
            formData.append("Message", m);
            const res = await MessageInstance.post(`/send-message/${SelectedUser._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            setImage(null);
            setPreviewImage("")
        } catch (error) {
            toast.error(error.response?.data?.message || "Unexpected error")
        }
    }

    useEffect(() => {
        if (ChatContainerRef.current) {
            ChatContainerRef.current.scrollTo({
                top: ChatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [Messages]);


    useEffect(() => {

        

        socket.on('new-message', (m) => {
               setMessages(Messages => [...Messages, m]);
        })


    }, [])


    return (
        <div className='chatContainer'>
            <div className="chatNavbar">
                <div className="navLeft">
                    <div className="navProfilePic">
                        <img src={SelectedUser.ProfilePic || avatar} alt="" />
                    </div>
                    <div className='navDataDiv'>
                        <div>{SelectedUser&&SelectedUser.FullName}</div>
                        <div>{connectedUsers.includes(SelectedUser._id)?"Active now" : "Offline"}</div>
                    </div>
                </div>
                <div className="navRight">
                    <div>
                        <Ellipsis color="#ffffff" />
                    </div>
                </div>
            </div>
            <div className="chatBox" ref={ChatContainerRef}>
                {[...Messages]?.map((e, i) => (AuthUser._id == e.SenderId ?

                    <div key={i} className='rightMessageContainer'>
                        <div className="rightMessageCard">
                            {!e.PicturePath == "" && <div className='MessageImageBox'> <img src={e.PicturePath || null} /></div>}
                            {e.Message}
                        </div>

                    </div>
                    :
                    <div className='leftMessageContainer'>
                        <div className="leftMessageCard">
                            {e.Message}
                        </div>
                    </div>
                ))}


            </div>

            <div className="inputBox">
                {PreviewImage && <div className='ImagePreviewBox'> <img src={PreviewImage} /><span onClick={() => { setImage(null); setPreviewImage(null) }}><X /></span></div>}
                <div className="inputBoxIcons">
                    <input type="file" onChange={handleImageChange} className='ImageInput' name="image" id="image" />
                    <label htmlFor="image"><Image /></label>

                </div>
                <div className="input">
                    <input type="text" onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }} value={message} onChange={handleChange} />
                    <button onClick={handleSubmit}><SendHorizontal color="#ffffff" /></button>
                </div>
            </div>
        </div>
    )
}

export default chatBox