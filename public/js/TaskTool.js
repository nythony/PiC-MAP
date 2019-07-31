const socket = io()

// Elements
const $header = document.querySelector('#header')
const $usersCreateTask = document.querySelector('#usersCreateTask')
const $usersEditTask = document.querySelector('#usersEditTask')
const $subtaskCategory = document.querySelector('#subtaskCategory')
const $subtask = document.querySelector('#subtask')
const $createSubTaskForm = document.querySelector('#createSubTaskForm')
const $editSubTaskForm = document.querySelector('#editSubTaskForm')
const $deleteSubTaskForm = document.querySelector('#deleteSubTaskForm')

// Templates
const headerTemplate = document.querySelector('#header-template').innerHTML
const subtaskCategoryTemplate = document.querySelector('#subtaskCategory-template').innerHTML
const subtaskTemplate = document.querySelector('#subtask-template').innerHTML
const usersCreateTaskTemplate = document.querySelector('#userscreatetask-template').innerHTML
const usersEditTaskTemplate = document.querySelector('#usersedittask-template').innerHTML

// Options
const {username, userid, roomNumber, TaskToolName, TaskTool_ID, projectNameVP, projectidVP, room, chatid} = Qs.parse(location.search, { ignoreQueryPrefix: true })
//console.log("qs: ", {username, userid, roomNumber, TaskToolName, TaskTool_ID, projectNameVP, projectidVP})

// Definition for header
const headerhtml = Mustache.render(headerTemplate, {
    username: username,
    userid: userid,
    TaskToolName: TaskToolName,
    projectNameVP: projectNameVP,
    projectidVP: projectidVP,
    room: room,
    chatid: chatid
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
    const DueDate = e.target.elements.DueDate.value
    const TaskTool_ID = e.target.elements.TaskTool_ID.value
    const Users = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value)

    socket.emit('createSubTask', {TaskName, TaskDesc, DueDate, TaskTool_ID, Users} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Subtask created!')
        var form = document.getElementById("createSubTaskForm")
        document.getElementById("createSubTask").style.display = "none";
        form.reset()
    })
})

// Listen for editSubTaskForm
$editSubTaskForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of editSubTaskForm form
    const TaskName = e.target.elements.TaskName.value
    const TaskDesc = e.target.elements.TaskDesc.value
    const DueDate = e.target.elements.DueDate.value
    const Task_ID = e.target.elements.Task_ID.value
    const Users = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value)

    socket.emit('editSubTask', {TaskName, TaskDesc, DueDate, TaskTool_ID, Task_ID, Users} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Subtask edited!')
        var form = document.getElementById("editSubTaskForm")
        document.getElementById("editSubTask").style.display = "none";
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
        document.getElementById("deleteSubTask").style.display = "none";
        form.reset()
    })
})

//A user is getting redirected to login because the project they are in has been deleted
socket.on("redirectToLogin", (error) => {

    if (error){
        console.log(error)
    }

    alert("This project as been deleted. Please log in again.");
    location.href = '/';

})


socket.emit('joinTaskTool', {username, userid, roomNumber, TaskToolName, TaskTool_ID}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

// Loading list of users in project
socket.emit('getUsersInProject', {projectidVP}, (userNamesIds) => {
    const UsersInProjectCreateTask = Mustache.render(usersCreateTaskTemplate, {
        userNamesIds
    })
    document.querySelector('#usersCreateTask').innerHTML = UsersInProjectCreateTask;
    const UsersInProjectEditTask = Mustache.render(usersEditTaskTemplate, {
        userNamesIds
    })
    document.querySelector('#usersEditTask').innerHTML = UsersInProjectEditTask;
})