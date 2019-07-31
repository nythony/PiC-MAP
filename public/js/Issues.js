const socket = io()

// Elements
const $header = document.querySelector('#header')
const $usersCreateIssue = document.querySelector('#usersCreateIssue')
const $usersEditIssue = document.querySelector('#usersEditIssue')
const $issueCategory = document.querySelector('#issueCategory')
const $issue = document.querySelector('#issue')
const $createIssueForm = document.querySelector('#createIssueForm')
const $editIssueForm = document.querySelector('#editIssueForm')
const $deleteIssueForm = document.querySelector('#deleteIssueForm')

// Templates
const headerTemplate = document.querySelector('#header-template').innerHTML
const issueCategoryTemplate = document.querySelector('#issueCategory-template').innerHTML
const issueTemplate = document.querySelector('#issue-template').innerHTML
const usersCreateIssueTemplate = document.querySelector('#userscreateissue-template').innerHTML
const usersEditIssueTemplate = document.querySelector('#userseditissue-template').innerHTML

// Options
const {username, userid, roomNumber, ProjectName, Project_ID, projectNameVP, projectidVP} = Qs.parse(location.search, { ignoreQueryPrefix: true })
//console.log("qs: ", {username, userid, roomNumber, ProjectName, Project_ID, projectNameVP, projectidVP})

// Definition for header
const headerhtml = Mustache.render(headerTemplate, {
    username: username,
    userid: userid,
    ProjectName: ProjectName,
    projectNameVP: projectNameVP,
    projectidVP: projectidVP
})
document.querySelector('#header').innerHTML = headerhtml
//console.log("headerhtml: ", headerhtml)

// Definition for issueCategory event
socket.on('issueCategory', (issueCategory) => {
    const html = Mustache.render(issueCategoryTemplate, {
        IssueCategory: issueCategory.IssueCategory
    })
    document.querySelector('#issueCategory').innerHTML = html
})

// Definition for issue event
socket.on('issue', (issues) => {
    const html = Mustache.render(issueTemplate, {
        issues
    })
    //console.log(issues)
    document.querySelector('#issue').innerHTML = html
})

// Listen for createIssueForm
$createIssueForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of createIssueForm form
    const IssueName = e.target.elements.IssueName.value
    const IssueDesc = e.target.elements.IssueDesc.value
    const DueDate = e.target.elements.DueDate.value
    const Project_ID = e.target.elements.Project_ID.value
    const Users = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value)

    socket.emit('createIssue', {IssueName, IssueDesc, DueDate, Project_ID, Users} , (error) => {
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
    const Users = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
        .map(item => item.value)

    socket.emit('editIssue', {IssueName, IssueDesc, DueDate, Project_ID, Issue_ID, Users} , (error) => {
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

//A user is getting redirected to login because the project they are in has been deleted
socket.on("redirectToLogin", (error) => {

    if (error){
        console.log(error)
    }

    alert("This project as been deleted. Please log in again.");
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