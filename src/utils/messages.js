export const generateMessage = (username, text) => {
    return { 
        text: text,
        username: username,
        createdAt: new Date().getTime()
    }
}

export const generateLocationMessage = (url, username) => {
    return {
        username: username,
        url: url,
        createdAt: new Date().getTime()
    }
}

