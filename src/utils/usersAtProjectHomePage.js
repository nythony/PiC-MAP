const projectHomePageUsers = []


const addUserToProjectHomePage = ({ id, usernameVP, useridVP, projectNameVP, projectidVP }) => {
    // Clean the data
    // username = username.trim().toLowerCase()
    // room = room.trim().toLowerCase()
    // userid = userid.trim().toLowerCase()
    // chatroomid = chatroomid.trim().toLowerCase()
    // Validate the data
    if (!usernameVP || !projectNameVP) {
        return {
            error: 'Username and project name are required!'
        }
    }

    // Check for existing user
    const existingUser = projectHomePageUsers.find((user) => {
        return projectHomePageUsers.projectNameVP === projectNameVP && projectHomePageUsers.usernameVP === usernameVP
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is already in use!'
        }
    }

    // Store user
    const user = { id, usernameVP, useridVP, projectNameVP, projectidVP }
    projectHomePageUsers.push(user)
    return { user }
}

const removeUserFromProjectHomePage = (id) => {
    const index = projectHomePageUsers.findIndex((user) => user.id === id)

    if (index !== -1) {
        return projectHomePageUsers.splice(index, 1)[0]
    }
}

const getUserInProjectHomePage = (id) => {
    return projectHomePageUsers.find((user) => user.id === id)
}




const getAllUsersInProjectHomePage = (projectidVP) => {
    // room = room.trim().toLowerCase()
    return users.filter((user) => user.projectidVP === projectidVP)
    teamMembers = []
    client.query('SELECT "User_ID" FROM "AttachUserP" WHERE "Project_ID" = '+projectName+';', (err1, teamIDresult) => {
        for (let foo of teamIDresult) {
            client.query('SELECT "UserName" FROM "User" WHERE "User_ID" = \''+foo["User_ID"]+'\';', (err2, teamnameresult) => {
                teamMembers.push(teamnameresult.rows[0]["UserName"])
            })
        }
    })
    return teamMembers
}

module.exports = {
    addUserToProjectHomePage,
    removeUserFromProjectHomePage,
    getUserInProjectHomePage,
    getAllUsersInProjectHomePage,
}