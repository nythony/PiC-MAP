const usersIssues = []

const addUserIssues = ({ id, username, userid, roomNumber, ProjectName, Project_ID }) => {

    // Validate the data
    if (!username || !roomNumber) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = usersIssues.find((user) => {
        return user.roomNumber === roomNumber && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is already in use!'
        }
    }

    // Store user
    const user = { id, username, userid, roomNumber, ProjectName, Project_ID }
    usersIssues.push(user)
    return { user }
}

const removeUserIssues= (id) => {
    const index = usersIssues.findIndex((user) => user.id === id)

    if (index !== -1) {
        return usersIssues.splice(index, 1)[0]
    }
}

const getUserIssues = (id) => {
    return usersIssues.find((user) => user.id === id)
}

const getUsersInRoomIssues = (roomNumber) => {
    // room = room.trim().toLowerCase()
    return usersIssues.filter((user) => user.roomNumber === roomNumber)
}

module.exports = {
    addUserIssues,
    removeUserIssues,
    getUserIssues,
    getUsersInRoomIssues
}