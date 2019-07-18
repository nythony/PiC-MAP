const users = []

const addUser = ({ id, username, userid, room, chatroomid, roomNumber }) => {
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
    const existingUser = users.find((user) => {
        return user.roomNumber === roomNumber && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is already in use!'
        }
    }

    // Store user
    const user = { id, username, userid, room, chatroomid, roomNumber }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}




const getUsersInRoom = (roomNumber) => {
    // room = room.trim().toLowerCase()
    return users.filter((user) => user.roomNumber === roomNumber)
}




module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
}