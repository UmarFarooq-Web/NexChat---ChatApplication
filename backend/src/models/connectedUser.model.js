import mongoose from "mongoose";


const connectedUserSchema = new mongoose.Schema({
    HolderId:String,
    UserId:String,
    IsPinned:Boolean
} , {timestamps:true})


const connectedUser = mongoose.model("ConnectedUser" , connectedUserSchema);

export default connectedUser;