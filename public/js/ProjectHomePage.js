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
    console.log("tasktools:" , tasktools)
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



// Listen for create task tool
$createTaskToolForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values (hidden and not hidden) of task tool form
    const taskTool = e.target.elements.TaskToolName.value
    const taskToolProjectID = e.target.elements.createTaskTool_ProjectID.value
    socket.emit('createTaskTool', {taskToolProjectID, taskTool}, (error) => { // send newTaskTool event to server
        // Enable form
        if (error) {
            return console.log(error)
        }
        // clear task tool form
        var form = document.getElementById("createTaskToolForm")
        form.reset()
    })
})


// Listen for edit task tool
$editTaskToolForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of editSubTaskForm form
    const taskTool = e.target.elements.TaskToolName.value
    const Project_ID = e.target.elements.editTaskTool_ProjectID.value
    const TaskTool_ID = e.target.elements.TaskTool_ID.value
    console.log("edit:" ,{taskTool, Project_ID, TaskTool_ID})

    socket.emit('editTaskTool', {taskTool, Project_ID, TaskTool_ID} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Task tool edited!')
        var form = document.getElementById("editTaskToolForm")
        form.reset()
    })
})

// Listen for delete task tool
$deleteTaskToolForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of createSubTaskForm form
    const TaskTool_ID = e.target.elements.TaskTool_ID.value
    console.log("delete:" ,{projectidVP, TaskTool_ID})
    socket.emit('deleteTaskTool', {projectidVP, TaskTool_ID} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Task tool deleted!')
        var form = document.getElementById("deleteTaskToolForm")
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