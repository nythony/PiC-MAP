const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateMessageHistory = (username, text, createdAt) => {
    return {
        username,
        text,
        createdAt
    }
}

const generateSubtask = (TaskName, TaskDesc, DueDate, TasksLabel, TaskCategory) => {
    return {
        TaskName,
        TaskDesc,
        DueDate,
        TasksLabel,
        TaskCategory
    }
}

module.exports = {
    generateMessage,
    generateMessageHistory,
    generateSubtask
}