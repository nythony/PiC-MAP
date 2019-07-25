
console.log("running UserHomePage.js")
const socket = io()

//////////////////////////
//  Enter UserHomePage  //
//////////////////////////

//var rCookie = document.cookie; Returns encoded cookie
const { username, password } = Qs.parse(location.search, { ignoreQueryPrefix: true })
var localProjects = [];

// When a user enters a projecthomepage, sends user info to server
socket.emit('enterUserHomePage', { username, password }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})



////////////////////
//  Project List  //
////////////////////

const projectListTemplate = document.querySelector('#projectList-template').innerHTML
const $projectList = document.querySelector('#project-list')

socket.on('projectList', (projects) => {

    localProjects = projects;
    console.log("in socket for projectList at userHomePage.js for iD: ", projects[1].projID)

    for (i = 1; i < projects.length; i++){

        const html = Mustache.render(projectListTemplate, {
            projectName: projects[i].projName,
            projectDescription: projects[i].projDesc,
            Project_ID: projects[i].projID
        })

        $projectList.insertAdjacentHTML('beforeend', html)
    }

})

// Definition for subtask event
socket.on('subtask', (subtasks) => {
    const html = Mustache.render(subtaskTemplate, {
        subtasks
    })
    //console.log(subtasks)
    document.querySelector('#subtask').innerHTML = html
})



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
    const name = e.target.elements.projectName.value
    const desc = e.target.elements.projectDescription.value
    const start = e.target.elements.startDate.value
    const due = e.target.elements.dueDate.value
    const user = username 

    console.log("Name: ", name)
    console.log("Desc: ", desc)
    console.log("Start: ", start)
    console.log("Due: ", due)
    console.log("Username: ", user)



    //To be heard by index.js
    socket.emit('createProject', {name, desc, start, due, user}, (error) => {
  
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


// Listen for submission of create-project-form
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
//  Delete Project  //
//////////////////////


const $deleteProjectForm = document.querySelector('#delete-project-form')

// Listen for submission of create-project-form
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

