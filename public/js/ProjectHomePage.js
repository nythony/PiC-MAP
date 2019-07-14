// ProjectHomePage socket.io

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


// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


// Definition for task tool event
socket.on('taskTool', (newTaskTool) => {
    const html = Mustache.render(taskToolsTemplate, {
        name: newTaskTool.name,
    })
    taskTools.insertAdjacentHTML('beforeend', html)
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


socket.emit('enterProjectHomePage', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})