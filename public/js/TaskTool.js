const socket = io()

// Elements
const $subtaskCategory = document.querySelector('#subtaskCategory')
const $subtask = document.querySelector('#subtask')

// Templates
const subtaskCategoryTemplate = document.querySelector('#subtaskCategory-template').innerHTML
const subtaskTemplate = document.querySelector('#subtask-template').innerHTML

// Options
console.log("Hello!")
const {username, userid, roomNumber, TaskToolName, TaskTool_ID} = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log({username, userid, roomNumber, TaskToolName, TaskTool_ID})

// Definition for subtaskCategory event
socket.on('subtaskCategory', (subtaskCategory) => {
    const html = Mustache.render(subtaskCategoryTemplate, {
        TaskCategory: subtaskCategory.TaskCategory
    })
    $subtaskCategory.insertAdjacentHTML('beforeend', html)
})

// Definition for subtask event
socket.on('subtask', (subtask) => {
    const html = Mustache.render(subtaskTemplate, {
        TaskName: subtask.TaskName,
        TaskDesc: subtask.TaskDesc,
        //TaskUsers: subtask.TaskUsers,
        DueDate: subtask.DueDate,
        TasksLabel: subtask.TasksLabel,
        TasksCategory: subtask.TasksCategory
    })
    $subtask.insertAdjacentHTML('beforeend', html)
})

socket.emit('joinTaskTool', {username, userid, roomNumber, TaskToolName, TaskTool_ID}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})