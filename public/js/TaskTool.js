const socket = io()

// Elements
const $subtaskCategory = document.querySelector('#subtaskCategory')
const $subtask = document.querySelector('#subtask')

// Templates
const subtaskCategoryTemplate = document.querySelector('#subtaskCategory-template').innerHTML
const subtaskTemplate = document.querySelector('#subtask-template').innerHTML

// Options
console.log("Hello!")