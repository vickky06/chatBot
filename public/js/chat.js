const socket =  io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate =document.querySelector('#message-template-location')
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Option
const { username, room }=Qs.parse(location.search , { ignoreQueryPrefix : true })


const autoscroll=()=>{
    //new Message 
    const $newMessage = $messages.lastElementChild

    //Height of the last message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight =  $newMessage.offsetHeight + newMessageMargin

    //visible Height
    const visibleHeight = $messages.offsetHeight

    //Height of the message Container
    const containerHeight = $messages.scrollHeight
    
    ///how far to scrolled?
    const scrollOffeset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight > scrollOffeset){
        $messages.scrollTop = $messages.scrollHeight+1
    }

}

socket.on('locationMessage', (message)=>{
    console.log('locationMessage ',message)
    const html = Mustache.render(locationMessageTemplate.innerHTML,{
        username : message.username,
        message: message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})


socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username : message.username,
        message: message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()    
})


$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value
   socket.emit('sendMessage',message,(error)=>
   {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()
       if(error)
       { 
           return console.log(error)
       }
       else{
       console.log('Message was delieverd')}
   })
    /// console.log('message received',msg)
})


$locationButton.addEventListener(
    'click',() =>{
        if(!navigator.geolocation){
        return alert('Google GeoLocation is not Supported at your Browser');
    }
    $locationButton.setAttribute('disabled','disabled')
    
    navigator.geolocation.getCurrentPosition((position)=>{
        //console.log(position)
        
        socket.emit('sendLocation',{
            
            latitude  :position.coords.latitude,
            longitude :position.coords.longitude
        },()=>{
            console.log('Location has been shared successfully!!')
            $locationButton.removeAttribute('disabled')
        })
    })
    }
)


socket.on('roomData',({room, users})=>
{   console.log("SIDEBAR--populating")
  console.log(room)
    console.log(users)
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
document.querySelector('#sidebar').innerHTML = html

  
})

socket.emit('join',{
    username,
    room
},(error)=>{
    if (error){
        alert(error)
        location.href = '/'
    }
})
