const socket = io()

// Definition for message event
socket.on('message', (message) => {
    console.log(message)
})

// Listen for message form
document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve message value of message form
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message)
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
    })
})