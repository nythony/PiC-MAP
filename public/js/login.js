// JavaScript source code

console.log('running login script')

const $loginForm = document.querySelector('#login-form')
const $loginFormUsername = $loginForm.querySelector('username')
const $loginFormPassword = $loginForm.querySelector('password')
const $createLoginForm = document.querySelector('#create-login-form')
const $createLoginFormUsername = $createLoginForm.querySelector('username')
const $createLoginFormPassword = $createLoginForm.querySelector('password')

$loginForm.addEventListener('submit', (e) => {
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
    })
})
