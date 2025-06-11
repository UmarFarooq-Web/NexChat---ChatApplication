import mongoose from "mongoose";

export default function ConnectDb(){
    try{
        mongoose.connect("mongodb://localhost:27017/NewChatApp")
        console.log("Database Connected!")
    }catch{
        console.log("Error! Database is not Connected")
    }

}