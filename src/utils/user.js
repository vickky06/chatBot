const users = []

//addUser, removeUser, getUser, getUserInRoom 

const addUser = ({id, username, room })=>{
    //console.log("add user --user.js")
    //Clean the data
    
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    //console.log("---step 1")
    //console.log(`username : ${username}`)
    //console.log(`room : ${room}`)
    //validate the data
    if(!(username || room)){
      //  console.log("---step error")
        return {
            error : 'Username and Room are required!'
        }
        
    }
    
    //console.log("---step 2")
    //check for existing user

    const existingUser = users.find((user) =>{
        return user.room ===room && user.username === username
    })

    if (existingUser){
        console.log("---step Existing user")
        return {
            error : 'Username is already in Use for this room!'
        }
    }

    //store User

    const user ={id,username,room}
    users.push(user)
    console.log(users)
    return {user}
}


const removeUser = (id) =>{
    console.log("Removing  User")
        const index = users.findIndex((user)=>{
            return user.id === id
        })

        if (index!==-1)
        {
            console.log("found and Removing")
            return users.splice(index, 1)[0]
        }
           
}


const getUser = (id)=>{
   //console.log('get user called :'+id)
 
    const index = users.find((user)=>{
        return user.id === id
    })
    //console.log("User is "+index)
    return index
}

const getUserInRoom = (room) =>{
    troom = room.trim().toLowerCase()
    var i;
    const filterUsers = []
    for(i=0;i<users.length;i++)
    {
        if (users[i].room === troom)
        {
           filterUsers.push(users[i])
        }
    }

    return filterUsers

}

module.exports ={
    addUser,
    removeUser,
    getUserInRoom,
    getUser
}