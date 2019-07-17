//When a form gets submitted, it goes to the eventListener of that form. The event listening then emits an event that is heard by index.js,
// which does the DB query stuff and emits another event heard by the socket.on(message)


const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, userid, room, chatroomid } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log({ username, userid, room, chatroomid })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far down scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

// Definition for message event
socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm:ss')
    })
    // New Messages show up at top inside messages div
    // $messagese.insertAdjacentHTML('afterbegin')
    // New Messages show up after element closes
    // $messagese.insertAdjacentHTML('afterend')
    // New Messages show up before messages div
    // $messagese.insertAdjacentHTML('beforebegin')
    // New Messages show up at bottom inside messages div
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

// We can use this for redirecting!
// socket.on('redirect', function(destination) {
//     window.location.href = destination;
// });

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

// Listen for message form
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Disable form
    //$messageFormButton.setAttribute('disabled', 'disabled')

    // Retrieve message value of message form
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
        var form = document.getElementById("message-form")
        form.reset()
    })
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
        })
    })
})

socket.emit('join', { username, userid, room, chatroomid }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})