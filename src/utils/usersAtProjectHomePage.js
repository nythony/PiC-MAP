const projectHomePageUsers = []


const addUserToProjectHomePage = ({ id, username, userid, projectname, projectid }) => {
    // Clean the data
    // username = username.trim().toLowerCase()
    // room = room.trim().toLowerCase()
    // userid = userid.trim().toLowerCase()
    // chatroomid = chatroomid.trim().toLowerCase()

    // Validate the data
    if (!username || !projectname) {
        return {
            error: 'Username and project name are required!'
        }
    }

    // Check for existing user
    const existingUser = projectHomePageUsers.find((user) => {
        return projectHomePageUsers.projectname === projectname && projectHomePageUsers.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is already in use!'
        }
    }

    // Store user
    const user = { id, username, userid, projectname, projectid }
    projectHomePageUsers.push(user)
    return { user }
}

const removeUserFromProjectHomePage = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUserInProjectHomePage = (id) => {
    return users.find((user) => user.id === id)
}




const getAllUsersInProjectHomePage = (room) => {
    // room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUserToProjectHomePage,
    removeUserFromProjectHomePage,
    getUserInProjectHomePage,
    getAllUsersInProjectHomePage,
}