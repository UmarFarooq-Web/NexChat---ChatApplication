import axios from "axios"


const AuthInstance = axios.create({
    baseURL:"http://localhost:3000/auth/api",
    withCredentials:true
})

export const MessageInstance = axios.create({
    baseURL:"http://localhost:3000/message",
    withCredentials:true
})


export default AuthInstance;