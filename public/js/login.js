
console.log('running login script')
const socket = io()

/* We are not using socket to verify credentials
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





function checkLogin(event) {
    event.preventDefault()
    // Retrieve username and password from login-form
    username = event.target.elements.username.value
    password = event.target.elements.password.value

    console.log(username)
    console.log(password)

}



function createNewLogin(event) { --CONVERT TO SOCKET?
    event.preventDefault()
    // Retrieve username and password from create-login-form
    username = event.target.elements.username.value
    password = event.target.elements.password.value
    
    console.log(username)
    console.log(password)

}


*/


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
        window.location='http://youtube.com'
    }, 3000);
    /*

                  // Your application has indicated there's an error
                        window.setTimeout(function(){

                            // Move to a new location or you can do something else
                            window.location.href = "https://www.google.com";

                        }, 5000);
                        */

})