const usersRequirements = []

const addUserRequirements = ({ id, username, userid, roomNumber, ProjectName, Project_ID }) => {
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
    const existingUser = usersRequirements.find((user) => {
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
    usersRequirements.push(user)
    return { user }
}

const removeUserRequirements= (id) => {
    const index = usersRequirements.findIndex((user) => user.id === id)

    if (index !== -1) {
        return usersRequirements.splice(index, 1)[0]
    }
}

const getUserRequirements = (id) => {
    return usersRequirements.find((user) => user.id === id)
}

const getUsersInRoomRequirements = (roomNumber) => {
    // room = room.trim().toLowerCase()
    return usersRequirements.filter((user) => user.roomNumber === roomNumber)
}

module.exports = {
    addUserRequirements,
    removeUserRequirements,
    getUserRequirements,
    getUsersInRoomRequirements
}