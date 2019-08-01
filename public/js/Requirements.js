const socket = io()

// Elements
const $header = document.querySelector('#header')
const $usersCreateRequirement = document.querySelector('#usersCreateRequirement')
const $usersEditRequirement = document.querySelector('#usersEditRequirement')
const $requirement1 = document.querySelector('#requirement1')
const $requirement2 = document.querySelector('#requirement2')
const $requirement3 = document.querySelector('#requirement3')
const $createRequirementForm = document.querySelector('#createRequirementForm')
const $editRequirementForm = document.querySelector('#editRequirementForm')
const $deleteRequirementForm = document.querySelector('#deleteRequirementForm')

// Templates
const headerTemplate = document.querySelector('#header-template').innerHTML
const requirement1Template = document.querySelector('#requirement1-template').innerHTML
const requirement2Template = document.querySelector('#requirement2-template').innerHTML
const requirement3Template = document.querySelector('#requirement3-template').innerHTML
const usersCreateRequirementTemplate = document.querySelector('#userscreaterequirement-template').innerHTML
const usersEditRequirementTemplate = document.querySelector('#userseditrequirement-template').innerHTML

// Options
const {username, userid, roomNumber, ProjectName, Project_ID, projectNameVP, projectidVP, chatname, chatid} = Qs.parse(location.search, { ignoreQueryPrefix: true })
//console.log("qs: ", {username, userid, roomNumber, ProjectName, Project_ID, projectNameVP, projectidVP})

// Definition for header
const headerhtml = Mustache.render(headerTemplate, {
    username: username,
    userid: userid,
    ProjectName: ProjectName,
    projectNameVP: projectNameVP,
    projectidVP: projectidVP,
    chatname: chatname,
    chatid: chatid
})
document.querySelector('#header').innerHTML = headerhtml
//console.log("headerhtml: ", headerhtml)

// Definitions for requirement event
socket.on('requirement1', (requirements1) => {
    const html1 = Mustache.render(requirement1Template, {
        requirements1
    })
    document.querySelector('#requirement1').innerHTML = html1
})

socket.on('requirement2', (requirements2) => {
    const html2 = Mustache.render(requirement2Template, {
        requirements2
    })
    document.querySelector('#requirement2').innerHTML = html2
})

socket.on('requirement3', (requirements3) => {
    const html3 = Mustache.render(requirement3Template, {
        requirements3
    })
    document.querySelector('#requirement3').innerHTML = html3
})

// Listen for createRequirementForm
$createRequirementForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of createRequirementForm form
    const RequirementName = e.target.elements.RequirementName.value
    const RequirementDesc = e.target.elements.RequirementDesc.value
    const DueDate = e.target.elements.DueDate.value
    const Project_ID = e.target.elements.Project_ID.value
    let RequirementCat;
    if (document.getElementById('r7').checked) {
        RequirementCat = document.getElementById('r7').value;
    }
    else  if (document.getElementById('r8').checked) {
        RequirementCat = document.getElementById('r8').value;
    }
    else  if (document.getElementById('r9').checked) {
        RequirementCat = document.getElementById('r9').value;
    }
    const Users = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value)

    socket.emit('createRequirement', {RequirementName, RequirementDesc, DueDate, Project_ID, Users, RequirementCat} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Requirement created!')
        var form = document.getElementById("createRequirementForm")
        document.getElementById("createRequirement").style.display = "none";
        form.reset()
    })
})

// Listen for editRequirementForm
$editRequirementForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of editRequirementForm form
    const RequirementName = e.target.elements.RequirementName.value
    const RequirementDesc = e.target.elements.RequirementDesc.value
    const DueDate = e.target.elements.DueDate.value
    const Req_ID = e.target.elements.Req_ID.value
    let RequirementCat;
    if (document.getElementById('r10').checked) {
        RequirementCat = document.getElementById('r10').value;
    }
    else  if (document.getElementById('r11').checked) {
        RequirementCat = document.getElementById('r11').value;
    }
    else  if (document.getElementById('r12').checked) {
        RequirementCat = document.getElementById('r12').value;
    }
    const Users = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value)

    socket.emit('editRequirement', {RequirementName, RequirementDesc, DueDate, Project_ID, Req_ID, Users, RequirementCat} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Requirement edited!')
        var form = document.getElementById("editRequirementForm")
        document.getElementById("editRequirement").style.display = "none";
        form.reset()
    })
})

// Listen for deleteRequirementForm
$deleteRequirementForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of createRequirementForm form
    const Req_ID = e.target.elements.Req_ID.value

    socket.emit('deleteRequirement', {Project_ID, Req_ID} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Requirement deleted!')
        var form = document.getElementById("deleteRequirementForm")
        document.getElementById("deleteRequirement").style.display = "none";
        form.reset()
    })
})

//A user is getting redirected to login
socket.on("redirectToLogin", (eMessage) => {
    alert(eMessage);
    location.href = '/';
 })


socket.emit('joinRequirements', {username, userid, roomNumber, ProjectName, Project_ID}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

// Loading list of users in project
socket.emit('getUsersInProject', {projectidVP}, (userNamesIds) => {
    const UsersInProjectCreateRequirement = Mustache.render(usersCreateRequirementTemplate, {
        userNamesIds
    })
    document.querySelector('#usersCreateRequirement').innerHTML = UsersInProjectCreateRequirement;
    const UsersInProjectEditRequirement = Mustache.render(usersEditRequirementTemplate, {
        userNamesIds
    })
    document.querySelector('#usersEditRequirement').innerHTML = UsersInProjectEditRequirement;
})