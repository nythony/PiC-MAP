
const socket = io()

//////////////////////////
//  Enter UserHomePage  //
//////////////////////////

//var rCookie = document.cookie; Returns encoded cookie
const { username, password } = Qs.parse(location.search, { ignoreQueryPrefix: true })
var localProjects = [];


//UserName Display
const welcomeUserTemplate = document.querySelector('#welcomeUser-template').innerHTML
const $welcomeUser = document.querySelector('#welcomeUser')

const html = Mustache.render(welcomeUserTemplate, {
messageDisplay: username

})

$welcomeUser.insertAdjacentHTML('beforeend', html)

// When a user enters a projecthomepage, sends user info to server
socket.emit('enterUserHomePage', { username, password}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }

})



////////////////////
//  Project List  //
////////////////////


const projectListTemplate = document.querySelector('#projectList-template').innerHTML
const $projectElement = document.querySelector('#projectElement')


socket.on('projectList', (projectList) => {

    localProjects = projectList;

        const html = Mustache.render(projectListTemplate, {
           
            projectList

        })
        document.querySelector('#projectElement').innerHTML = html

})

//A user made a change (edit/delete). Need to refresh project list
socket.on("refreshProjectList", (error) => {
    //Ask index.js for project list, and index will render
    socket.emit("getProjectList", username, (error) => {

        if (error) {
            return console.log(error)
        }

    })
})


////////////////////
//  Join Project  //
////////////////////


const $joinProjectForm = document.querySelector('#join-project-form')

// Listen for submission of join-project-form
$joinProjectForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve inputs
    const name = e.target.elements.projectName.value
    const pass = e.target.elements.projectPassword.value
    const joinid = e.target.elements.joinid.value
    const user = username


    //To be heard by index.js
    socket.emit('joinProject', {name, pass, user, joinid}, (error) => {

        if (error) {
            return console.log(error)
        }

        var form = document.getElementById("join-project-form")
        document.getElementById("joinProjectForm").style.display = "none";
        form.reset()
    })
})



socket.on('joinProjectFail', (eMessage) => {

    alert(eMessage)

})


//////////////////////
//  Create Project  //
//////////////////////

const $createProjectForm = document.querySelector('#create-project-form')

// Listen for submission of create-project-form
$createProjectForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve inputs
    const pass = e.target.elements.projectPassword.value
    const name = e.target.elements.projectName.value
    const desc = e.target.elements.projectDescription.value
    const start = e.target.elements.startDate.value
    const due = e.target.elements.dueDate.value
    const user = username 

    //To be heard by index.js
    socket.emit('createProject', {pass, name, desc, start, due, user}, (error) => {
        console.log("sending: ",{pass, name, desc, start, due, user})
  
        if (error) {
            return alert(error)
        }

        var form = document.getElementById("create-project-form")
        document.getElementById("projectForm").style.display = "none";
        form.reset()
    })
})



//////////////////////
//   Edit Project   //
//////////////////////


const $editProjectForm = document.querySelector('#edit-project-form')


// Listen for submission of edit-project-form
$editProjectForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve inputs
    const name = e.target.elements.projectName.value
    const desc = e.target.elements.projectDescription.value
    const start = e.target.elements.startDate.value
    const due = e.target.elements.dueDate.value
    const id = e.target.elements.editProject_ID.value
    const user = username


    //To be heard by index.js
    socket.emit('editProject', {name, desc, start, due, user, id}, (error) => {
    //localProjects contains [username, {P1}, {P2}, {P...}]
        console.log(user) //works

        if (error) {
            return console.log(error)
        }

        var form = document.getElementById("edit-project-form")
        document.getElementById("editProjectForm").style.display = "none";
        form.reset()
    })
})


//////////////////////
//  Delete Project  //
//////////////////////


const $deleteProjectForm = document.querySelector('#delete-project-form')

// Listen for submission of delete-project-form
$deleteProjectForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve inputs
    const name = e.target.elements.projectName.value
    const id = e.target.elements.deleteProject_ID.value
    const user = username


    //To be heard by index.js
    socket.emit('deleteProject', {name, id, user}, (error) => {

        if (error) {
            return console.log(error)
        }

        var form = document.getElementById("delete-project-form")
        document.getElementById("deleteProjectForm").style.display = "none";
        form.reset()
    })
})



socket.on('deleteProjectFail', (eMessage) => {

    alert(eMessage);


})

