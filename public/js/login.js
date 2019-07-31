
console.log('running login script')
const socket = io()
//console.log("SocketID ", socket.id)

var id = 0;

// When a user enters the login page, sends socket info to server
socket.emit('enterLogin', (error) => {
	//console.log("IN LOGIN.JS: ", socket.id);
	id = socket.id;

	document.getElementById("socketid").value = id;
    document.getElementById("socketid2").value = id;
    
    if (error) {
        alert(error)
        location.href = '/'
    }
})

//Error message
socket.on('failedRegistration', (eMessage) => {
    console.log("We are getting here at login.js failed Registraton")

    alert('Username already taken.');
    location.href = '/';

})



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