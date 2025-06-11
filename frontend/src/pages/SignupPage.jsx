import React from 'react'
import "./LoginPage.css"
import { Link  , useNavigate} from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Eye, EyeClosed, LoaderCircle , X , Check } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthInstance from '../lib/Auth.Axios'
import useAuthStore from '../stores/auth.store'

const SignupPage = () => {
    const [data, setData] = useState({ FullName: "", Username: "", Email: "", Password: "" });
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [IsLoading, setIsLoading] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [IsUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [IsCheckingUsername, setIsCheckingUsername] = useState(false);
    const [IsUsernameChecked , setIsUsernameChecked] = useState(false);
    const [debouncedUsername, setDebouncedUsername] = useState("");
    const navigate = useNavigate()

    const {setAuthUser} = useAuthStore();

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({ ...data, [name]: value });
    }


    useEffect(() => {

        if (isFirstRender) {
            setIsFirstRender(false);
            return
        }

        if (!debouncedUsername) return;

        setIsCheckingUsername(true);
        const timer = setTimeout(async () => {

            try {
                setIsUsernameChecked(true);
                const res = await AuthInstance.get(`/check-username/${debouncedUsername}`);
                setData({ ...data, Username: debouncedUsername })
                setIsUsernameAvailable(true);
            } catch {
                toast.error("Username is already taken")
                setIsUsernameAvailable(false)
            } finally {
                setIsCheckingUsername(false)
            }

            

        }, 1000)
        return () => {
            clearTimeout(timer)
        }
    }, [debouncedUsername])
    
    
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleSubmit = async() => {
        if (!(data.Password == ConfirmPassword)) return toast.error("Password don't match!")

            if (!data.FullName || !data.Username || !data.Email || !data.Password) return toast.error("All Fields are Required")

        if (!data.Email.includes("@") || !data.Email.includes(".")) return toast.error("Incorrect Email Format!");
        
        if(!IsUsernameAvailable) return toast.error("Enter a Valid Username");
        

        try{
            const res = await AuthInstance.post("/signup" , data);
            setAuthUser(res.data);
            toast.success("Sign Up Successfully");
            navigate("/home")
            
        }catch(error){
            toast.error(error?.response?.data?.message || "Unexpected Error!")
            console.log("Error in handleSubmit in Signup page : " , error);
        }

    }

    return (
        <div className='loginContainer'>
            <div className="innerLoginContainer">
                <h1 className='LoginHeading'>Welcome</h1>
                <p>Bringing people together, one message at a time.</p>

                <div className="usernameInputDiv">
                    <input type="text" onChange={handleChange} name='FullName' id='fullnameInputField' value={data.FullName} className="usernameInput" placeholder='Full Name' />
                    <label htmlFor="fullnameInputField" className='usernameLabel'>Full Name</label>
                </div>

                <div className={`usernameInputDiv ${IsUsernameChecked? IsCheckingUsername?"":IsUsernameAvailable?"border border-green-500":"border border-red-500":""}`}>
                    <input type="text" onChange={(e) => { setDebouncedUsername(e.target.value); if(!e.target.value) setIsUsernameChecked(false) } } name='Username' value={debouncedUsername} className="usernameInput" id='usernameInputField' placeholder='Username' />
                    {IsUsernameChecked? IsCheckingUsername?<div><LoaderCircle className='animate-spin' /></div>:IsUsernameAvailable?<Check color='green' />:<X color="red" />:""}
                    <label htmlFor="usernameInputField" className='usernameLabel'>Username</label>
                </div>

                <div className="usernameInputDiv">
                    <input type="text" onChange={handleChange} name="Email" value={data.Email} id='emailInputField' className="usernameInput" placeholder='Email' />
                    <label htmlFor="emailInputField" className='usernameLabel'>Email</label>
                </div>

                <div className="usernameInputDiv">
                    <input type={showPassword ? "text" : "password"} id='passwordInputField'  onChange={handleChange} name='Password' value={data.Password} className="usernameInput" placeholder='Password' />
                    <div className='ShowPasswordDiv' style={{ opacity: 1, transform: showPassword ? "rotate(0deg)" : "rotate(180deg)" }} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeClosed /> : <Eye />}
                    </div>
                    <label htmlFor="passwordInputField" className='usernameLabel'>Password</label>
                </div>

                <div className="usernameInputDiv">
                    <input type={showPassword2 ? "text" : "password"}  onChange={handleConfirmPasswordChange} name='ConfirmPassword' id='cPasswordInputField' value={ConfirmPassword} className="usernameInput" placeholder='Confirm Password' />
                    <div className='ShowPasswordDiv' style={{ opacity: 1, transform: showPassword2 ? "rotate(0deg)" : "rotate(180deg)" }} onClick={() => setShowPassword2(!showPassword2)}>
                        {showPassword2 ? <EyeClosed /> : <Eye />}
                    </div>
                    <label htmlFor="cPasswordInputField" className='usernameLabel'>Confirm Password</label>
                </div>

                <button className='loginBtn' disabled={IsLoading} onClick={handleSubmit}>{IsLoading ? <LoaderCircle className="animate-spin" /> : "Sign Up"}</button>
                <div className='lastDiv'>Don't have an account? Signup <span><Link to={"/login"} >here</Link></span></div>
            </div>
        </div>
    )
}

export default SignupPage