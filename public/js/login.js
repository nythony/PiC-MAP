
console.log('running login script')
const socket = io()


const $loginForm = document.querySelector('#login-form')
const $loginFormUsername = $loginForm.querySelector('username')
const $loginFormPassword = $loginForm.querySelector('password')
const $loginFormButton = $loginForm.querySelector('button')

const $createLoginForm = document.querySelector('#create-login-form')
const $createLoginFormUsername = $createLoginForm.querySelector('username')
const $createLoginFormPassword = $createLoginForm.querySelector('password')
const $createLoginFormButton = $createLoginForm.querySelector('button')

//Form submission - function calls
$loginForm.addEventListener('submit', checkLogin)
$createLoginForm.addEventListener('submit', createNewLogin)

//Error message
const failedLoginTemplate = document.querySelector('#failedLogin-template').innerHTML
const $loginFail = document.querySelector('#loginFail')


function checkLogin(event) {
    event.preventDefault()
    // Retrieve username and password from login-form
    username = event.target.elements.username.value
    password = event.target.elements.password.value

    console.log(username)
    console.log(password)

}


function createNewLogin(event) {
    event.preventDefault()
    // Retrieve username and password from create-login-form
    username = event.target.elements.username.value
    password = event.target.elements.password.value
    
    console.log(username)
    console.log(password)

}

socket.on('failedLogin', (eMessage) => {

    const html = Mustache.render(failedLoginTemplate, {
        messageDisplay: eMessage
    })

    $loginFail.insertAdjacentHTML('beforeend', html)

    var form = document.getElementById("login-form")
    form.reset()

})