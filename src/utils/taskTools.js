

// If this doesn't get more complicated I will delete
// But if we want the taskTool object to show more than just the name, this will be necessary
const generateTaskTool = (taskToolName) => {
    return {
        taskToolName,
        //createdAt: new Date().getTime()
    }
}



module.exports = {
    generateTaskTool
}