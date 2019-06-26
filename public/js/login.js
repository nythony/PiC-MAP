// JavaScript source code

console.log('running login script');

const $loginForm = document.querySelector('#login-form')
const $loginFormUsername = $loginForm.querySelector('username')
const $loginFormPassword = $loginForm.querySelector('password')
const $loginFormButton = $loginForm.querySelector('button')

const $createLoginForm = document.querySelector('#create-login-form')
const $createLoginFormUsername = $createLoginForm.querySelector('username')
const $createLoginFormPassword = $createLoginForm.querySelector('password')
const $createLoginFormButton = $createLoginForm.querySelector('button')

$loginForm.addEventListener('submit', checkLogin)
$createLoginForm.addEventListener('submit', createNewLogin)


function checkLogin(event) {
    event.preventDefault()
    // Retrieve username and password from login-form
    username = event.target.elements.username.value
    password = event.target.elements.password.value

    console.log(username)
    console.log(password)

    const fs = require('fs')
    fs.readFile('../users.txt', 'utf8', function (err, data) {
        console.log(data)
    })
}


function createNewLogin(event) {
    event.preventDefault()
    // Retrieve username and password from create-login-form
    username = event.target.elements.username.value
    password = event.target.elements.password.value
    
    console.log(username)
    console.log(password)

}