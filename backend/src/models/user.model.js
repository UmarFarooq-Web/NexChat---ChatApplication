import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    FullName:String,
    Username:String,
    Email:String,
    Password:String,
    ProfilePic:String
} , {timestamps:true})


const user = mongoose.model("User" , userSchema);

export default user;