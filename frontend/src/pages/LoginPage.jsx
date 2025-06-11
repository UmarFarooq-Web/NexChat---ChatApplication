import React, { useState } from 'react'
import toast from "react-hot-toast"
import "./LoginPage.css"
import { Link } from 'react-router-dom'
import AuthInstance from "../lib/Auth.Axios.js"
import useAuthStore from '../stores/auth.store.js'
import { LoaderCircle , EyeClosed , Eye } from "lucide-react"

const LoginPage = () => {
    const [data, SetData] = useState({ Email: "", Password: "" });
    const { setAuthUser } = useAuthStore();
    const [IsLoading, setIsLoading] = useState(false)

    const [showPassword  , setShowPassword] = useState(false);




    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        SetData({ ...data, [name]: value })

    }


    const handleSubmit = async () => {
        if (!data.Email || !data.Password) return toast.error("All Fields are required");
        if (!data.Email.includes("@") || !data.Email.includes(".")) return toast.error("Invalid Email Format");

        try {
            setIsLoading(true);
            const res = await AuthInstance.post("/login", data , {withCredentials:true});
            setAuthUser(res.data);
            toast.success("Login Successful");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Unexpected Error!")
            console.log("Error in login handleSubmit function");
        } finally {
            setIsLoading(false)
        }



    }

    return (
        <div className='loginContainer'>
            <div className="innerLoginContainer">
                <h1 className='LoginHeading'>Welcome Back!</h1>
                <p>Bringing people together, one message at a time.</p>

                <div className="usernameInputDiv">
                    <input type="text" name='Email' value={data.Email} onChange={handleChange} id='usernameInputField' className="usernameInput" placeholder='Email' />
                    <label htmlFor="usernameInputField" className='usernameLabel'>Email</label>
                </div>

                <div className="usernameInputDiv">
                    <input type="text" name='Password' value={data.Password} onChange={handleChange} id='PasswordInputField' className="usernameInput" placeholder='Password' />
                    <div className='ShowPasswordDiv' style={{ opacity: 1, transform: showPassword ? "rotate(0deg)" : "rotate(180deg)" }} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeClosed /> : <Eye />}
                    </div>
                    <label htmlFor="PasswordInputField" className='usernameLabel'>Password</label>
                </div>
                <div className='lastDiv passwordDiv'><span><Link to={"/"} >Forget Password?</Link></span></div>

                <button className='loginBtn' onClick={handleSubmit} disabled={IsLoading}> {IsLoading ? <LoaderCircle className="animate-spin" /> : "Login"} </button>
                <div className='lastDiv'>Don't have an account? Signup <span><Link to={"/signup"} >here</Link></span></div>
            </div>
        </div>
    )
}

export default LoginPage