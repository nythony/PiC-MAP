
console.log('running login script')
const socket = io()

// We are not using socket to verify credentials
const $loginForm = document.querySelector('#login-form')
const $loginFormUsername = $loginForm.querySelector('username')
const $loginFormPassword = $loginForm.querySelector('password')
const $loginFormButton = $loginForm.querySelector('button')

//Form is getting submitted to createNewUser/submit. Not using socket.
// const $createLoginForm = document.querySelector('#create-login-form')
// const $createLoginFormUsername = $createLoginForm.querySelector('username')
// const $createLoginFormPassword = $createLoginForm.querySelector('password')
// const $createLoginFormButton = $createLoginForm.querySelector('button')



//Form submission - function calls
$loginForm.addEventListener('submit', checkLogin)
$createLoginForm.addEventListener('submit', createNewLogin)



function checkLogin(event) {
    event.preventDefault()
    // Retrieve username and password from login-form
    username = event.target.elements.username.value
    password = event.target.elements.password.value

    console.log(username)
    console.log(password)

        //To be heard by index.js
    socket.emit('verifyCredentials', {username, password}, (error) => {
    
        if (error) {
            console.log("Not able to emit")
            return console.log(error)
        }

    })

}



// function createNewLogin(event) {
//     event.preventDefault()
//     // Retrieve username and password from create-login-form
//     username = event.target.elements.username.value
//     password = event.target.elements.password.value
    
//     console.log(username)
//     console.log(password)

// }




//Error message
const failedLoginTemplate = document.querySelector('#failedLogin-template').innerHTML
const $loginFail = document.querySelector('#loginFail')

socket.on('failedLogin', (eMessage) => {

    const html = Mustache.render(failedLoginTemplate, {
        messageDisplay: eMessage
    })

    $loginFail.insertAdjacentHTML('beforeend', html)

    var form = document.getElementById("login-form")
    form.reset()

    var timer = setTimeout(function() {
        window.location='/'
    }, 8000);

})