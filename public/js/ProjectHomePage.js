// ProjectHomePage socket.io

const socket = io()

// Elements
const $header = document.querySelector('#header')
const $taskTool = document.querySelector('#taskTool')
const $reqButton = document.querySelector('#reqButton')	
const $issuesButton = document.querySelector('#issuesButton')	
const $chatappButton = document.querySelector('#chatappButton')

const $createTaskToolForm = document.querySelector('#createTaskToolForm')
const $editTaskToolForm = document.querySelector('#editTaskToolForm')
const $deleteTaskToolForm = document.querySelector('#deleteTaskToolForm')

// Templates
const headerTemplate = document.querySelector('#header-template').innerHTML
const taskToolTemplate = document.querySelector('#tasktool-template').innerHTML
const requirementsButtonTemplate = document.querySelector('#requirementsButton-template').innerHTML	
const issuesButtonTemplate = document.querySelector('#issuesButton-template').innerHTML	
const chatappButtonTemplate = document.querySelector('#chatappButton-template').innerHTML



// Get user data
// some of these aren't used as this passes through the query, not cookie
const { usernameVP, useridVP, projectidVP, projectNameVP, chatname, chatid } = Qs.parse(location.search, { ignoreQueryPrefix: true })


// Definition for header
const headerhtml = Mustache.render(headerTemplate, {
    username: usernameVP,
    projectName: projectNameVP
})
document.querySelector('#header').innerHTML = headerhtml


// Fill requirements button with necessary navigation info	
const rButton = Mustache.render(requirementsButtonTemplate, {	
    username: usernameVP,	
    userid: useridVP,	
    ProjectName: projectNameVP,	
    Project_ID: projectidVP,	
    chatname: chatname,	
    chatid: chatid	
})	
$reqButton.innerHTML = rButton	

 // Fill issues button with necessary navigation info	
const iButton = Mustache.render(issuesButtonTemplate, {	
    username: usernameVP,	
    userid: useridVP,	
    ProjectName: projectNameVP,	
    Project_ID: projectidVP,	
    chatname: chatname,	
    chatid: chatid	
})	
$issuesButton.innerHTML = iButton	

 // Fill chatapp button with necessary navigation info	
const cButton = Mustache.render(chatappButtonTemplate, {	
    username: usernameVP,	
    userid: useridVP,	
    ProjectName: projectNameVP,	
    Project_ID: projectidVP,	
    room: chatname,	
    chatroomid: chatid	
})	
$chatappButton.innerHTML = cButton		



// Definition for task tool event
socket.on('taskTool', (tasktools) => {
    const html = Mustache.render(taskToolTemplate, {
        tasktools,
        chatname: chatname,	
        chatid: chatid
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
        document.getElementById("createTaskTool").style.display = "none";
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

    socket.emit('editTaskTool', {taskTool, Project_ID, TaskTool_ID} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Task tool edited!')
        var form = document.getElementById("editTaskToolForm")
        document.getElementById("editTaskTool").style.display = "none";
        form.reset()
    })
})

// Listen for delete task tool
$deleteTaskToolForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of createSubTaskForm form
    const TaskTool_ID = e.target.elements.TaskTool_ID.value
    socket.emit('deleteTaskTool', {projectidVP, TaskTool_ID} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Task tool deleted!')
        var form = document.getElementById("deleteTaskToolForm")
        document.getElementById("deleteTaskTool").style.display = "none";
        form.reset()
    })
})

//A user is getting redirected to login
socket.on("redirectToLogin", (eMessage) => {

    alert(eMessage);
    location.href = '/';

})


socket.on("setPassword", (pass) =>{
    document.getElementById("password").value = pass;
})

var i = 0;
// When a user enters a projecthomepage, sends user info to server
socket.emit('enterProjectHomePage', { usernameVP, useridVP, projectNameVP, projectidVP }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }

    id = socket.id;
    document.getElementById("socketid").value = id;
    document.getElementById("username").value = usernameVP;
    
})