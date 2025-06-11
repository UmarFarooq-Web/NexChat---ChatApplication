import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    SenderId:String,
    ReceiverId:String,
    Message:String,
    PicturePath:String,
    ReceivedAt:String,
    SendAt:String,
    SeenAt:String,
} , {timestamps:true})

const message = mongoose.model("Message" , messageSchema)

export default message;