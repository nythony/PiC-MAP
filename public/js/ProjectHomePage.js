// ProjectHomePage socket.io

const socket = io()

// Elements
const $header = document.querySelector('#header')
const $taskTool = document.querySelector('#taskTool')
const $createTaskToolForm = document.querySelector('#createTaskToolForm')
const $editTaskToolForm = document.querySelector('#editTaskToolForm')
const $deleteTaskToolForm = document.querySelector('#deleteTaskToolForm')

// Templates
const headerTemplate = document.querySelector('#header-template').innerHTML
const taskToolTemplate = document.querySelector('#tasktool-template').innerHTML



// Get user data
// some of these aren't used as this passes through the query, not cookie
const { usernameVP, useridVP, room, chatroomid, projectNameVP, projectidVP } = Qs.parse(location.search, { ignoreQueryPrefix: true })


// Definition for header
const headerhtml = Mustache.render(headerTemplate, {
    username: usernameVP,
    projectName: projectNameVP,
})
document.querySelector('#header').innerHTML = headerhtml



// Definition for task tool event
socket.on('taskTool', (tasktools) => {
    console.log(tasktools)
    const html = Mustache.render(taskToolTemplate, {
        tasktools
    })
    document.querySelector('#taskTool').innerHTML = html
})

// load the project data (this is not in use yet, but i plan on making this show team members on project)
socket.on('projectData', ({ projectname, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        projectname,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})



// Listen for task tool form submit
$taskToolForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values (hidden and not hidden) of task tool form
    const taskTool = e.target.elements.newTaskToolName.value
    const taskToolProjectID = e.target.elements.newTaskProjectID.value
    const taskToolProjectName = e.target.elements.newTaskProjectName.value
    socket.emit('newTaskTool', {taskToolProjectID, taskToolProjectName, taskTool}, (error) => { // send newTaskTool event to server
        // Enable form
        if (error) {
            return console.log(error)
        }
        // clear task tool form
        var form = document.getElementById("taskTool-form")
        form.reset()
    })
})


// When a user enters a projecthomepage, sends user info to server
socket.emit('enterProjectHomePage', { usernameVP, useridVP, projectNameVP, projectidVP }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})