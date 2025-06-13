import jwt from "jsonwebtoken"


const getToken = (userId) =>{

    const token = jwt.sign({userId} ,  process.env.JWT_SECRET , {expiresIn:"7d"}) 

    return token;
}

export default getToken;