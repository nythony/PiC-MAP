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
        tasktoolname: newTaskTool.taskToolName
    })
    console.log("rendering: ", newTaskTool.taskToolName)
    taskTools.insertAdjacentHTML('beforeend', html)
})


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

    // Disable form
    //$messageFormButton.setAttribute('disabled', 'disabled')

    // Retrieve task tool name value of task tool form
    const taskTool = e.target.elements.newTaskToolName.value
    const taskToolProjectID = e.target.elements.newTaskProjectID.value
    console.log("ID PLZ: ", taskToolProjectID)

    socket.emit('newTaskTool', {taskToolProjectID, taskTool}, (error) => {
        // Enable form
        if (error) {
            return console.log(error)
        }
        // clear task tool form
        var form = document.getElementById("taskTool-form")
        form.reset()
    })
})


socket.emit('enterProjectHomePage', { usernameVP, useridVP, projectNameVP, projectidVP }, (error) => {
    console.log("ENTER PROJECT EVENT for :", socket.id)
    if (error) {
        alert(error)
        location.href = '/'
    }
})