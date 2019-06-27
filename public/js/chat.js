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
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


// Definition for message event
socket.on('message', (message) => {
    console.log(message)
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
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('HH:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
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

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})