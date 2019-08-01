const socket = io()

// Elements
const $header = document.querySelector('#header')
const $usersCreateIssue = document.querySelector('#usersCreateIssue')
const $usersEditIssue = document.querySelector('#usersEditIssue')
const $issue1 = document.querySelector('#issue1')
const $issue2 = document.querySelector('#issue2')
const $issue3 = document.querySelector('#issue3')
const $createIssueForm = document.querySelector('#createIssueForm')
const $editIssueForm = document.querySelector('#editIssueForm')
const $deleteIssueForm = document.querySelector('#deleteIssueForm')

// Templates
const headerTemplate = document.querySelector('#header-template').innerHTML
const issue1Template = document.querySelector('#issue1-template').innerHTML
const issue2Template = document.querySelector('#issue2-template').innerHTML
const issue3Template = document.querySelector('#issue3-template').innerHTML
const usersCreateIssueTemplate = document.querySelector('#userscreateissue-template').innerHTML
const usersEditIssueTemplate = document.querySelector('#userseditissue-template').innerHTML

// Options
const {username, userid, roomNumber, ProjectName, Project_ID, projectNameVP, projectidVP, chatname, chatid} = Qs.parse(location.search, { ignoreQueryPrefix: true })

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

// Definitions for issue event
socket.on('issue1', (issues1) => {
    const html1 = Mustache.render(issue1Template, {
        issues1
    })
    document.querySelector('#issue1').innerHTML = html1
})

socket.on('issue2', (issues2) => {
    const html2 = Mustache.render(issue2Template, {
        issues2
    })
    document.querySelector('#issue2').innerHTML = html2
})

socket.on('issue3', (issues3) => {
    const html3 = Mustache.render(issue3Template, {
        issues3
    })
    document.querySelector('#issue3').innerHTML = html3
})

// Listen for createIssueForm
$createIssueForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of createIssueForm form
    const IssueName = e.target.elements.IssueName.value
    const IssueDesc = e.target.elements.IssueDesc.value
    const DueDate = e.target.elements.DueDate.value
    const Project_ID = e.target.elements.Project_ID.value
    let IssueCat;
    if (document.getElementById('r1').checked) {
        IssueCat = document.getElementById('r1').value;
    }
    else  if (document.getElementById('r2').checked) {
        IssueCat = document.getElementById('r2').value;
    }
    else  if (document.getElementById('r3').checked) {
        IssueCat = document.getElementById('r3').value;
    }
    const Users = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value)

    socket.emit('createIssue', {IssueName, IssueDesc, DueDate, Project_ID, Users, IssueCat} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Issue created!')
        var form = document.getElementById("createIssueForm")
        document.getElementById("createIssue").style.display = "none";
        form.reset()
    })
})

// Listen for editIssueForm
$editIssueForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of editIssueForm form
    const IssueName = e.target.elements.IssueName.value
    const IssueDesc = e.target.elements.IssueDesc.value
    const DueDate = e.target.elements.DueDate.value
    const Issue_ID = e.target.elements.Issue_ID.value
    let IssueCat;
    if (document.getElementById('r4').checked) {
        IssueCat = document.getElementById('r4').value;
    }
    else  if (document.getElementById('r5').checked) {
        IssueCat = document.getElementById('r5').value;
    }
    else  if (document.getElementById('r6').checked) {
        IssueCat = document.getElementById('r6').value;
    }
    const Users = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value)

    socket.emit('editIssue', {IssueName, IssueDesc, DueDate, Project_ID, Issue_ID, Users, IssueCat} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Issue edited!')
        var form = document.getElementById("editIssueForm")
        document.getElementById("editIssue").style.display = "none";
        form.reset()
    })
})

// Listen for deleteIssueForm
$deleteIssueForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of createIssueForm form
    const Issue_ID = e.target.elements.Issue_ID.value

    socket.emit('deleteIssue', {Project_ID, Issue_ID} , (error) => {
        // Enable form

        if (error) {
            return console.log(error)
        }

        console.log('Issue deleted!')
        var form = document.getElementById("deleteIssueForm")
        document.getElementById("deleteIssue").style.display = "none";
        form.reset()
    })
})

//A user is getting redirected to login
socket.on("redirectToLogin", (eMessage) => {
    alert(eMessage);
    location.href = '/';
 })


socket.emit('joinIssues', {username, userid, roomNumber, ProjectName, Project_ID}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

// Loading list of users in project
socket.emit('getUsersInProject', {projectidVP}, (userNamesIds) => {
    const UsersInProjectCreateIssue = Mustache.render(usersCreateIssueTemplate, {
        userNamesIds
    })
    document.querySelector('#usersCreateIssue').innerHTML = UsersInProjectCreateIssue;
    const UsersInProjectEditIssue = Mustache.render(usersEditIssueTemplate, {
        userNamesIds
    })
    document.querySelector('#usersEditIssue').innerHTML = UsersInProjectEditIssue;
})