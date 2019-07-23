
console.log("running UserHomePage.js")
const socket = io()


////////////////////
//  Project List  //
////////////////////

//var rCookie = document.cookie; Returns encoded cookie

const { username, password } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log("Object ", { username, password });


// When a user enters a projecthomepage, sends user info to server
socket.emit('enterUserHomePage', { username, password }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('projectList', (projects) => {
    console.log(projects)
})


// //Error message
// const failedLoginTemplate = document.querySelector('#failedLogin-template').innerHTML
// const $loginFail = document.querySelector('#loginFail')

// socket.on('failedLogin', (eMessage) => {

//     const html = Mustache.render(failedLoginTemplate, {
//         messageDisplay: eMessage
//     })

//     $loginFail.insertAdjacentHTML('beforeend', html)

//     var form = document.getElementById("login-form")
//     form.reset()

//     var timer = setTimeout(function() {
//         window.location='/'
//     }, 8000);

// })



//////////////////////
//   Edit Project   //
//////////////////////






// var projectMemberList = [] //do not need to add creator, because create button should automatically create AttachUserP for creator --Might not need
// // Elements
// const $addMembers = document.querySelector('#add-project-members')
// const $addMembersInput = $addMembersInput.querySelector('input')
// const $addMembersButton = $addMembersInput.querySelector('button')

// //When the add button is clicked to add a user (in edit project) --STILL NEED TO IMPLEMENT AND TEST IF WORKS
// $addMembers.addEventListener('submit', (e) => {
//     e.preventDefault()

//     // Retrieve message value of message form
//     const member = e.target.elements.project-member.value

//     socket.emit('addProjectMember', member, (error) => {
//         // Enable form

//         if (error) {
//             return console.log(error)
//         }

//         var form = document.getElementById("add-project-members")
//         form.reset()
//     })
// })




//////////////////////
//	Create Project  //
//////////////////////

const $createProjectForm = document.querySelector('#create-project-form')
const $createProjectFormInput = $createProjectForm.querySelector('input')
const $createProjectFormButton = $createProjectForm.querySelector('button')


// Listen for submission of create-project-form
$createProjectForm.addEventListener('submit', (e) => {
	console.log("A project is being created")

    e.preventDefault()

    // Retrieve inputs
    const name = e.target.elements.projectName.value
    const desc = e.target.elements.projectDescription.value
    const start = e.target.elements.startDate.value
    const due = e.target.elements.dueDate.value
    const id = e.target.elements.userid.value

    console.log("Name: ", name)
    console.log("Desc: ", desc)
    console.log("Start: ", start)
    console.log("Due: ", due)
    console.log("ID (hidden): ", )



    //To be heard by index.js
    socket.emit('createProject', {name, desc, start, due, id}, (error) => {
  
        if (error) {
            return console.log(error)
        }

        var form = document.getElementById("create-project-form")
        document.getElementById("projectForm").style.display = "none";
        form.reset()
    })
})


