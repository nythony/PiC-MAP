const socket = io()

var projectMemberList = [] //do not need to add creator, because create button should automatically create AttachUserP for creator
// Elements
const $addMembers = document.querySelector('#add-project-members')
const $addMembersInput = $addMembersInput.querySelector('input')
const $addMembersButton = $addMembersInput.querySelector('button')

socket.on('project-member', (project) => {
    console.log(project-member)
    projectMemberList.push(project-member)
})


