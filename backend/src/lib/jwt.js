import jwt from "jsonwebtoken"

const JWT_SECRET = "123456789";

const getToken = (userId) =>{

    const token = jwt.sign({userId} ,  JWT_SECRET , {expiresIn:"7d"}) 

    return token;
}

export default getToken;