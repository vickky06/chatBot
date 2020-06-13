//setting up express
const path =  require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const {
    generateMessage
} = require('./utils/messages')
const {
    addUser,
    removeUser,
    getUserInRoom,
    getUser
} = require('./utils/user')

const app = express()
const server =  http.createServer(app)
const io = socketio(server)
const Filter = require('bad-words')

const port = process.env.PORT|| 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))



io.on('connection',(socket) => {
    //console.log('new connection line 29')
    
    socket.on('join',({username,room},callback)=>{
      //  console.log("---step 1")
        //add user to room
       const {error,user}= addUser({
            id:socket.id,
            username,
            room
        })

        if (error){
            console.log("---step error")
            return callback(error)
                }

        socket.join(user.room)
        //console.log("---step 3")

        socket.emit('message',generateMessage('Welcome ',user.username,'!!'))
        //console.log("---step 4")
        socket.broadcast.to(user.room).emit('message',generateMessage('Hey Admin',`${user.username} has Joined`))
        //console.log(getUserInRoom(user.room))
        io.to(user.room).emit('roomData',{
            room : user.room,
            users: getUserInRoom(user.room)
        })
       // console.log("---step 5")
        callback()
        //console.log("---step 6")
    
    })
    
    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id)
        
        const filter = new Filter()
        
        if (filter.isProfane(message)){
            return callback('Profanity not allowed')
        }
        //console.log("-------------------------------------------------------------------------------")
//console.log(user)
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
    })
    socket.on('disconnect',()=>{
        //remove user
        const user=removeUser(socket.id)
        if (user)
        {
            io.to(user.room).emit('message',generateMessage('Hey Admin' ,`${user.username} had to leave!!`))
            console.log(getUserInRoom(user.room))
            io.to(user.room).emit('roomData',{
                room : user.room,
                users: getUserInRoom(user.room)
            })
        }
       
    })

    socket.on('sendLocation',(coords,callback)=>{
        console.log("send location")
        const user = getUser(socket.id)
        console.log(user)
        io.to(user.room).emit('locationMessage', generateMessage(user.username,`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    
})






server.listen(port, () => {

    console.log('Server is up at $!'+port)
})