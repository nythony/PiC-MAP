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
const $taskToolFormInput = $taskToolForm.querySelector('input')
const $taskToolFormButton = $taskToolForm.querySelector('button')
const $taskTools = document.querySelector('#taskTools')


// Templates
const taskToolsTemplate = document.querySelector('#taskTools-template').innerHTML


// Get user data
const { usernameVP, useridVP, room, chatroomid, projectNameVP, projectidVP } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log("user: ", usernameVP)   
console.log("projectname: ", projectNameVP)


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



// Listen for task tool form
$taskToolForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Disable form
    //$messageFormButton.setAttribute('disabled', 'disabled')

    // Retrieve task tool name value of task tool form
    const taskTool = e.target.elements.taskTool.value

    socket.emit('sendMessage', taskTool, (error) => {
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