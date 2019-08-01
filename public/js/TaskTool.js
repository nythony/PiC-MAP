const socket = io()

// Elements
const $header = document.querySelector('#header')
const $usersCreateTask = document.querySelector('#usersCreateTask')
const $usersEditTask = document.querySelector('#usersEditTask')
const $subtask1 = document.querySelector('#subtask1')
const $subtask2 = document.querySelector('#subtask2')
const $subtask3 = document.querySelector('#subtask3')
const $createSubTaskForm = document.querySelector('#createSubTaskForm')
const $editSubTaskForm = document.querySelector('#editSubTaskForm')
const $deleteSubTaskForm = document.querySelector('#deleteSubTaskForm')

// Templates
const headerTemplate = document.querySelector('#header-template').innerHTML
const subtask1Template = document.querySelector('#subtask1-template').innerHTML
const subtask2Template = document.querySelector('#subtask2-template').innerHTML
const subtask3Template = document.querySelector('#subtask3-template').innerHTML
const usersCreateTaskTemplate = document.querySelector('#userscreatetask-template').innerHTML
const usersEditTaskTemplate = document.querySelector('#usersedittask-template').innerHTML

// Options
const {username, userid, roomNumber, TaskToolName, TaskTool_ID, projectNameVP, projectidVP, chatname, chatid} = Qs.parse(location.search, { ignoreQueryPrefix: true })

// Definition for header
const headerhtml = Mustache.render(headerTemplate, {
    username: username,
    userid: userid,
    TaskToolName: TaskToolName,
    projectNameVP: projectNameVP,
    projectidVP: projectidVP,
    chatname: chatname,
    chatid: chatid
})
document.querySelector('#header').innerHTML = headerhtml

// Definitions for subtask event
socket.on('subtask1', (subtask1) => {
    const html1 = Mustache.render(subtask1Template, {
        subtask1
    })
    document.querySelector('#subtask1').innerHTML = html1
})

socket.on('subtask2', (subtask2) => {
    const html2 = Mustache.render(subtask2Template, {
        subtask2
    })
    document.querySelector('#subtask2').innerHTML = html2
})

socket.on('subtask3', (subtask3) => {
    const html3 = Mustache.render(subtask3Template, {
        subtask3
    })
    document.querySelector('#subtask3').innerHTML = html3
})

// Listen for createSubTaskForm
$createSubTaskForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of createSubTaskForm form
    const TaskName = e.target.elements.TaskName.value
    const TaskDesc = e.target.elements.TaskDesc.value
    const DueDate = e.target.elements.DueDate.value
    const TaskTool_ID = e.target.elements.TaskTool_ID.value
    let TaskCat;
    if (document.getElementById('r13').checked) {
        TaskCat = document.getElementById('r13').value;
    }
    else  if (document.getElementById('r14').checked) {
        TaskCat = document.getElementById('r14').value;
    }
    else  if (document.getElementById('r15').checked) {
        TaskCat = document.getElementById('r16').value;
    }
    const Users = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value)

    socket.emit('createSubTask', {TaskName, TaskDesc, DueDate, TaskTool_ID, Users, TaskCat} , (error) => {
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
    let TaskCat;
    if (document.getElementById('r16').checked) {
        TaskCat = document.getElementById('r16').value;
    }
    else  if (document.getElementById('r17').checked) {
        TaskCat = document.getElementById('r17').value;
    }
    else  if (document.getElementById('r18').checked) {
        TaskCat = document.getElementById('r18').value;
    }
    const Users = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value)

    socket.emit('editSubTask', {TaskName, TaskDesc, DueDate, TaskTool_ID, Task_ID, Users, TaskCat} , (error) => {
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

//A user is getting redirected to login
socket.on("redirectToLogin", (eMessage) => {
    alert(eMessage);
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