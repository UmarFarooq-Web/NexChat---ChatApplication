import mongoose from "mongoose";

export default function ConnectDb(){
    try{
        mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected!")
    }catch{
        console.log("Error! Database is not Connected")
    }

}