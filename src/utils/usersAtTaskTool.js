const usersTaskTool = []

const addUserTaskTool = ({ id, username, userid, roomNumber, TaskToolName, TaskTool_ID }) => {
    // Clean the data
    // username = username.trim().toLowerCase()
    // room = room.trim().toLowerCase()
    // userid = userid.trim().toLowerCase()
    // chatroomid = chatroomid.trim().toLowerCase()

    // Validate the data
    if (!username || !roomNumber) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = usersTaskTool.find((user) => {
        return user.roomNumber === roomNumber && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is already in use!'
        }
    }

    // Store user
    const user = { id, username, userid, roomNumber, TaskToolName, TaskTool_ID }
    usersTaskTool.push(user)
    return { user }
}

const removeUserTaskTool= (id) => {
    const index = usersTaskTool.findIndex((user) => user.id === id)

    if (index !== -1) {
        return usersTaskTool.splice(index, 1)[0]
    }
}

const getUserTaskTool = (id) => {
    return usersTaskTool.find((user) => user.id === id)
}




const getUsersInRoomTaskTool= (roomNumber) => {
    // room = room.trim().toLowerCase()
    return usersTaskTool.filter((user) => user.roomNumber === roomNumber)
}




module.exports = {
    addUserTaskTool,
    removeUserTaskTool,
    getUserTaskTool,
    getUsersInRoomTaskTool,
}