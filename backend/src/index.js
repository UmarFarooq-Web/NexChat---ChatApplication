import express from "express";
import AuthRoute from "./routes/Auth.route.js"
import MessageRoute from "./routes/Message.Route.js"
import ConnectDb from "./lib/database.js";
// import cookieParser from "cookieParser";
import cookieParser from "cookie-parser"
import cors from "cors";
import {Server} from "socket.io"
import http from "http"

const app = express()
const server = http.createServer(app)

const io = new Server(server , {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }});
const port = 3000

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/auth/api" , AuthRoute )
app.use("/message" , MessageRoute)



io.on('connection' , (socket)=>{

  socket.on('join' , (UserId)=>{
    socket.join(UserId);
  })

  socket.on('send-message' , ({SenderId , ReceiverId , Message , PicturePath})=>{

    io.to(ReceiverId).emit('new-message' , {SenderId , ReceiverId , Message , PicturePath})
  })

})




server  .listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  ConnectDb();
})