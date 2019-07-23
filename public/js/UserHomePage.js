
console.log("running UserHomePage.js")
const socket = io()

//////////////////////////
//  Enter UserHomePage  //
//////////////////////////

//var rCookie = document.cookie; Returns encoded cookie
const { username, password } = Qs.parse(location.search, { ignoreQueryPrefix: true })

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

    for (i = 1; i < projects.length(); i++){
        console.log("AT: ", i)
        console.log("WITH: ", projects[i])
        console.log("VALUE: ", projects[i].projName)

        const html = Mustache.render(projectListTemplate, {
            projectName: projects[i].projName
            project Description: projects[i].projDesc
        })

        $projectList.insertAdjacentHTML('beforeend', html)
    }

})



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


