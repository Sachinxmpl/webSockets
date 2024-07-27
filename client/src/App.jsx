import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material"
import { useEffect , useMemo, useState } from "react"
import {io} from "socket.io-client"

function App() {
  const socket = useMemo(()=>{
    return io("http://localhost:3000")
  } , [])

  const [chats , setChats] = useState([])
  const [message , setMessage] = useState("")
  const [room , setRoom] = useState("")
  const [socketId , setsocketId] = useState("")
  const [roomName , setroomName] = useState("")
  const handleSubmit = (e) =>{
    e.preventDefault()
    socket.emit("message" , {message , room})
    setMessage("")
  }

  const joinRoomHandler = (e) =>{
    e.preventDefault()
    socket.emit("join-room" , roomName )
    setroomName("")
  }

  useEffect(()=>{
    socket.on("connect" , ()=>{
      console.log("Connected from client" , socket.id)
      setsocketId(socket.id)
    })

    socket.on("welcome" , (message)=>{
      console.log(message)
    })

    socket.on("broadcast" , (msg)=>{
      console.log(msg)
    })

    socket.on("receiveMessage" , (msg)=>{
      console.log(msg)
      setChats((prev)=>{
        return [...prev , msg]
      })
      console.log(chats)
    })

    return ()=>{
      socket.disconnect() 
    }
  } , [])


 


  return (
    <>
       <Container maxWidth="sm">
            <Box sx={{height: 200}} />
            <Typography variant="h4" component="div" gutterBottom>
                Welcome to the chat 
            </Typography>

            <Typography variant="h4" component="div" gutterBottom>
               {
                socketId
               } 
            </Typography>

              <form onSubmit={(e)=> joinRoomHandler(e) }>
                    <h5> Join room </h5>
                    <TextField id="outlined-basic" label="RoomName" value={roomName} variant="outlined" onChange={(e)=>{
                    setroomName(e.target.value)
                  }}>
                  </TextField>

                  
                  <Button type="submit" variant="container" color="primary">Join </Button>
              </form>

            <form onSubmit={(e)=> handleSubmit(e)}>

                  <TextField id="outlined-basic" label="Message" value={message} variant="outlined" onChange={(e)=>{
                    setMessage(e.target.value)
                  }}>
                  </TextField>

                  <TextField id="outlined-basic" label="Room" value={room} variant="outlined" onChange={(e)=>{
                    setRoom(e.target.value)
                  }}>
                  </TextField>
                   

                  <Button type="submit" variant="container" color="primary"> Send message</Button>
            </form>

          <ul>
          
           {
            chats.map((chat) =>{
              return(
              <li> {chat}</li>
              )
            })
           }
           </ul>
        </Container>
    </>
  )
    
}

export default App
