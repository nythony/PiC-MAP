// ProjectHomePage socket.io

console.log("running ProjectHomePage.js")
const socket = io()

// Elements
/*
const $newProjectForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
*/
const $taskToolForm = document.querySelector('#taskTool-form')
const $taskToolFormInput = $taskToolForm.querySelector('tasktoolname-createTaskTool')
const $taskToolFormButton = $taskToolForm.querySelector('button')
const $taskTools = document.querySelector('#taskTools')


// Templates
const taskToolsTemplate = document.querySelector('#taskTools-template').innerHTML


// Get user data
// some of these aren't used as this passes through the query, not cookie
const { usernameVP, useridVP, room, chatroomid, projectNameVP, projectidVP } = Qs.parse(location.search, { ignoreQueryPrefix: true })



// Definition for task tool event
socket.on('taskTool', (newTaskTool) => {
    const html = Mustache.render(taskToolsTemplate, {
        tasktoolname: newTaskTool.taskToolName // package the new task tool
    })
    taskTools.insertAdjacentHTML('beforeend', html) // insert into html
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