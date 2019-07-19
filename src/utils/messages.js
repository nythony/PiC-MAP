const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateMessageHistory = (username, text) => {
    return {
        username,
        text,
        createdAt
    }
}

module.exports = {
    generateMessage,
    generateMessageHistory
}