const socket = io()

// Elements
const $header = document.querySelector('#header')
const $subtaskCategory = document.querySelector('#subtaskCategory')
const $subtask = document.querySelector('#subtask')
const $createSubTaskForm = document.querySelector('#createSubTaskForm')
const $editSubTaskForm = document.querySelector('#editSubTaskForm')
const $deleteSubTaskForm = document.querySelector('#deleteSubTaskForm')

// Templates
const headerTemplate = document.querySelector('#header-template').innerHTML
const subtaskCategoryTemplate = document.querySelector('#subtaskCategory-template').innerHTML
const subtaskTemplate = document.querySelector('#subtask-template').innerHTML

// Options
const {username, userid, roomNumber, TaskToolName, TaskTool_ID, projectNameVP} = Qs.parse(location.search, { ignoreQueryPrefix: true })

// Definition for header
const headerhtml = Mustache.render(headerTemplate, {
    username: username,
    TaskToolName: TaskToolName,
    projectNameVP: projectNameVP
})
document.querySelector('#header').innerHTML = headerhtml

// Definition for subtaskCategory event
socket.on('subtaskCategory', (subtaskCategory) => {
    const html = Mustache.render(subtaskCategoryTemplate, {
        TaskCategory: subtaskCategory.TaskCategory
    })
    document.querySelector('#subtaskCategory').innerHTML = html
})

// Definition for subtask event
socket.on('subtask', (subtasks) => {
    const html = Mustache.render(subtaskTemplate, {
        subtasks
    })
    //console.log(subtasks)
    document.querySelector('#subtask').innerHTML = html
})

// Listen for createSubTaskForm
$createSubTaskForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of createSubTaskForm form
    const TaskName = e.target.elements.TaskName.value
    const TaskDesc = e.target.elements.TaskDesc.value
    const TaskTool_ID = e.target.elements.TaskTool_ID.value

    socket.emit('createSubTask', {TaskName, TaskDesc, TaskTool_ID} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Subtask created!')
        var form = document.getElementById("createSubTaskForm")
        form.reset()
    })
})

// Listen for editSubTaskForm
$editSubTaskForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of editSubTaskForm form
    const TaskName = e.target.elements.TaskName.value
    const TaskDesc = e.target.elements.TaskDesc.value
    const Task_ID = e.target.elements.Task_ID.value

    socket.emit('editSubTask', {TaskName, TaskDesc, TaskTool_ID, Task_ID} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Subtask edited!')
        var form = document.getElementById("editSubTaskForm")
        form.reset()
    })
})

// Listen for deleteSubTaskForm
$deleteSubTaskForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of createSubTaskForm form
    const Task_ID = e.target.elements.Task_ID.value

    socket.emit('deleteSubTask', {TaskTool_ID, Task_ID} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Subtask deleted!')
        var form = document.getElementById("deleteSubTaskForm")
        form.reset()
    })
})

socket.emit('joinTaskTool', {username, userid, roomNumber, TaskToolName, TaskTool_ID}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})