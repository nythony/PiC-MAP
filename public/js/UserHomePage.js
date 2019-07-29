
console.log("running UserHomePage.js")
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
    console.log("in socket for projectList at userHomePage.js: ", projectList)



        const html = Mustache.render(projectListTemplate, {
           
            projectList

        })
        document.querySelector('#projectElement').innerHTML = html

})


////////////////////
//  Join Project  //
////////////////////


const $joinProjectForm = document.querySelector('#join-project-form')

// Listen for submission of join-project-form
$joinProjectForm.addEventListener('submit', (e) => {
    console.log("A user is joining a project")

    e.preventDefault()

    // Retrieve inputs
    const name = e.target.elements.projectName.value
    const pass = e.target.elements.projectPassword.value
    const user = username

    console.log("Name: ", name)
    console.log("Pass: ", pass)
    console.log("Username (hidden): ", user)


    //To be heard by index.js
    socket.emit('joinProject', {name, pass, user}, (error) => {

        if (error) {
            return console.log(error)
        }

        var form = document.getElementById("join-project-form")
        document.getElementById("joinProjectForm").style.display = "none";
        form.reset()
    })
})



//Error message
const joinProjectTemplate = document.querySelector('#joinProjectFail-template').innerHTML
const $joinProjectFail = document.querySelector('#joinProjectFail')


socket.on('joinProjectFail', (eMessage) => {

    document.getElementById("joinProjectForm").style.display = "block";

    const html = Mustache.render(joinProjectTemplate, {
        messageDisplay: eMessage
    })

    $joinProjectFail.insertAdjacentHTML('beforeend', html)

})

//sfjasdf laehfwaeihflaiwehf;aoewfh;aweihfawiehflaiwehfliawehfaliehfliaweuhfliawehfliawehfliawuehflkvnk.awehweh


//////////////////////
//  Create Project  //
//////////////////////

const $createProjectForm = document.querySelector('#create-project-form')
// const $createProjectFormInput = $createProjectForm.querySelector('input')
// const $createProjectFormButton = $createProjectForm.querySelector('button')


// Listen for submission of create-project-form
$createProjectForm.addEventListener('submit', (e) => {
    console.log("A project is being created")

    e.preventDefault()

    // Retrieve inputs
    const pass = e.target.elements.projectPassword.value
    const name = e.target.elements.projectName.value
    const desc = e.target.elements.projectDescription.value
    const start = e.target.elements.startDate.value
    const due = e.target.elements.dueDate.value
    const user = username 

    console.log("Pass: ", pass)
    console.log("Name: ", name)
    console.log("Desc: ", desc)
    console.log("Start: ", start)
    console.log("Due: ", due)
    console.log("Username: ", user)



    //To be heard by index.js
    socket.emit('createProject', {pass, name, desc, start, due, user}, (error) => {
  
        if (error) {
            return console.log(error)
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
    console.log("A project is being edited")

    e.preventDefault()

    // Retrieve inputs
    const name = e.target.elements.projectName.value
    const desc = e.target.elements.projectDescription.value
    const start = e.target.elements.startDate.value
    const due = e.target.elements.dueDate.value
    const id = e.target.elements.editProject_ID.value
    const user = username

    console.log("Name: ", name)
    console.log("Desc: ", desc)
    console.log("Start: ", start)
    console.log("Due: ", due)
    console.log("Username (hidden): ", user)
    console.log("ProjectID (hidden): ", id)



    //
    //WORKING ON GETTING EDIT FORM TO WORK. Get Query on editing
    //


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
    console.log("A project is being deleted")

    e.preventDefault()

    // Retrieve inputs
    const name = e.target.elements.projectName.value
    const id = e.target.elements.deleteProject_ID.value
    const user = username

    console.log("Name: ", name)
    console.log("ProjectID (hidden): ", id)
    console.log("Username (hidden): ", user)


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



//Error message
const deleteProjectTemplate = document.querySelector('#deleteProjectFail-template').innerHTML
const $deleteProjectFail = document.querySelector('#deleteProjectFail')


socket.on('deleteProjectFail', (eMessage) => {

    document.getElementById("deleteProjectForm").style.display = "block";

    const html = Mustache.render(deleteProjectTemplate, {
        messageDisplay: eMessage
    })

    $deleteProjectFail.insertAdjacentHTML('beforeend', html)

})

