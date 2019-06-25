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



function checkLogin(event) {
    event.preventDefault()
    // Retrieve message value of message form
    username = event.target.elements.username.value
    password = event.target.elements.username.password


    fr = new FileReader()
    text = fr.readAsText("../users.txt")
}