// JavaScript source code


console.log('running login script');

const pg = require('pg')


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

    var pg = require('pg')
}


function createNewLogin(event) {
    event.preventDefault()
    // Retrieve username and password from create-login-form
    username = event.target.elements.username.value
    password = event.target.elements.password.value
    
    console.log(username)
    console.log(password)

}