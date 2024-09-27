
import express from "express";
const app = express()
import http from "http"
const port = 3000;
import { Server } from "socket.io";


const server = http.createServer(app)

//create a socket server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})



io.on("connection" , (socket)=>{
    console.log(`User with ${socket.id} connected`)

    //* socket.emit("welcome" ,`welcome to server ${socket.id}`)
    //* socket.broadcast.emit("broadcast" , `This is a broadcast message ${socket.id}`)

    socket.on("disconnect" , ()=>{
        console.log(`User disconnected ${socket.id}`)
    })

    socket.on("message" ,(data)=>{
            console.log(data)
            // io.emit("receiveMessage" , message)  both entire io
            if(data.room.length==0){
                    io.emit("broadcastmessage",data.message)
            }
            socket.to(data.room).emit("receiveMessage",data.message)
    })

    socket.on("join-room" , (room)=>{
       socket.join(room) 
       console.log(`User joined ${room}`)
    })

})

app.get("/", (req, res) => {
    res.send("Hello world ")
})


server.listen(port, () => {
    console.log("Listening to server 3000")
})
