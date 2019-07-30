const socket = io()

// Elements
const $header = document.querySelector('#header')
const $requirementCategory = document.querySelector('#requirementCategory')
const $requirement = document.querySelector('#requirement')
const $createRequirementForm = document.querySelector('#createRequirementForm')
const $editRequirementForm = document.querySelector('#editRequirementForm')
const $deleteRequirementForm = document.querySelector('#deleteRequirementForm')

// Templates
const headerTemplate = document.querySelector('#header-template').innerHTML
const requirementCategoryTemplate = document.querySelector('#requirementCategory-template').innerHTML
const requirementTemplate = document.querySelector('#requirement-template').innerHTML

// Options
const {username, userid, roomNumber, ProjectName, Project_ID, projectNameVP, projectidVP} = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log("qs: ", {username, userid, roomNumber, ProjectName, Project_ID, projectNameVP, projectidVP})

// Definition for header
const headerhtml = Mustache.render(headerTemplate, {
    username: username,
    userid: userid,
    ProjectName: ProjectName,
    projectNameVP: projectNameVP,
    projectidVP: projectidVP
})
document.querySelector('#header').innerHTML = headerhtml
console.log("headerhtml: ", headerhtml)

// Definition for requirementCategory event
socket.on('requirementCategory', (requirementCategory) => {
    const html = Mustache.render(requirementCategoryTemplate, {
        RequirementCategory: requirementCategory.RequirementCategory
    })
    document.querySelector('#requirementCategory').innerHTML = html
})

// Definition for requirement event
socket.on('requirement', (requirements) => {
    const html = Mustache.render(requirementTemplate, {
        requirements
    })
    //console.log(requirements)
    document.querySelector('#requirement').innerHTML = html
})

// Listen for createRequirementForm
$createRequirementForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Retrieve values of createRequirementForm form
    const RequirementName = e.target.elements.RequirementName.value
    const RequirementDesc = e.target.elements.RequirementDesc.value
    const DueDate = e.target.elements.DueDate.value
    const Project_ID = e.target.elements.Project_ID.value

    socket.emit('createRequirement', {RequirementName, RequirementDesc, DueDate, Project_ID} , (error) => {
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

    socket.emit('editRequirement', {RequirementName, RequirementDesc, DueDate, Project_ID, Req_ID} , (error) => {
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

//A user is getting redirected to login because the project they are in has been deleted
socket.on("redirectToLogin", (error) => {

    if (error){
        console.log(error)
    }

    alert("This project as been deleted. Please log in again.");
    location.href = '/';

})


socket.emit('joinRequirements', {username, userid, roomNumber, ProjectName, Project_ID}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})