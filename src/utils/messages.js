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

module.exports = {
    generateMessage,
    generateMessageHistory
}