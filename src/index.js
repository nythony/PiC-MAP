// Importing all things set up by project
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { Client } = require('pg')
const bodyParser = require('body-parser')
const url = require('url')

// Importing all things from other parts of project
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const project = require('./projectForm.js')

//Connecting to cloud based database:
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
})
client.connect()

// Additional setup and initialization
const app = express()
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000; //Talk to browser through this port
const publicDirectoryPath = path.join(__dirname, '../public/')
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '../public/views'))

// Trying to mask some user authentication
class Passer {
    constructor(userid, project, task){
        this.userid = userid
        this.project = project
        this.task = task
    }
}


// IO


// When a user connects
// Connection event is built in
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user} = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        // Display only to connection
        socket.emit('message', generateMessage('Admin', `Welcome to ${room}!`))
        // Display to everyone but the connection
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined ${room}`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    // Display to everyone
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    // When a user disconnects
    // Disconnect event is built in
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})



// App.get stuff

// Landing page for the app
app.get('/', function (req, res) {
    res.sendfile(publicDirectoryPath + 'views/loginPage.html');
})

// Login Page
app.get("/loginPage", function (req, res) {
    res.sendFile(publicDirectoryPath + "views/loginPage.html")
})

// When user enters incorrect login information - sends failedLoginPage.html
app.get("/failedLoginPage", function (req, res) {
    res.sendFile(publicDirectoryPath + "views/failedLoginPage.html")
})

// When createNewUser is loaded - sends createNewUser.html
app.get("/createNewUser", function (req, res) {
    res.sendFile(publicDirectoryPath + "views/createNewUser.html")
})

app.get("/UserHomePage/:result", function (req, res) {
    var user = AuthUser
    res.render("UserHomePage", { user:user })
})

// View results of login
// app.get("/loginResult/:result", function (req, res) {
//     res.render("loginResult", { output: req.params.result })
// })

// Was using this to test some react stuff.
// app.get('/', function (req, res) {
//     res.sendfile(publicDirectoryPath + 'views/HelloWorld.html');
// })

// Current version of how to submit projects to db
app.get("/projectform", function (req, res) {
    project.getProject(req, res);
    res.sendFile(publicDirectoryPath + "views/projectForm.html");
})

// Current version of chatApp (Must be updated)
app.get("/chatapp", function (req, res) {
    res.sendFile(publicDirectoryPath + "views/chatApp.html")
})

// Signin page for chatApp (Must be updated)
app.get("/chatSignIn", function (req, res) {
    res.sendFile(publicDirectoryPath + "views/chatSignIn.html")
})

// This isn't being used
// app.get('/login', function (req, res) {
//     res.sendFile(publicDirectoryPath + 'views/userForm.html');
// })

// This isn't being used
// app.get("/about", function (req, res) {
//     res.sendFile(publicDirectoryPath + "views/about.html");
// })

// This isn't being used
// app.get("/contact", function (req, res) {
//     res.sendFile(publicDirectoryPath + "views/contact.html");
// })

// This isn't being used
// app.get("/userform", function (req, res) {
//     res.sendFile(publicDirectoryPath + "views/userForm.html");
// })

// This isn't being used
// app.get("/jobstoryform", function (req, res) {
//     res.sendFile(publicDirectoryPath + "views/jobStoryForm.html");
// })

// This isn't being used
// app.get("/taskform", function (req, res) {
//     res.sendFile(publicDirectoryPath + "views/taskForm.html");
// })

// This isn't being used
// app.get("/issueform", function (req, res) {
//     res.sendFile(publicDirectoryPath + "views/issueForm.html");
// })



// App.post stuff

// When user wants to navigate to create new user page - redirects to createNewUser
app.post("/loginPage/createNewUser", function (req, res) {
    res.redirect('/createNewUser')
})

// When user wants to navigate to create new user page from failedLoginPage - redirects to createNewUser
app.post("/failedLoginPage/createNewUser", function (req, res) {
    res.redirect('/createNewUser')
})

// When user wants to navigate to login page from createNewUser - redirects to loginPage
app.post("/createNewUser/login", function (req, res) {
    res.redirect('/loginPage')
})

app.post("/loginPage/submit", function (req, res) {
    var username = req.body.username
    var password = req.body.password
    var toRedirect = '/failedLoginPage'
    client.query('SELECT "UserName" FROM "User";', (error, results) => {
        if (error) throw error
        for (let row of results.rows) {
            if (row["UserName"] == username) {
                client.query('SELECT "Password" FROM "User" WHERE "UserName" = \'' + username + '\';', (error1, results1) => {
                    if (error1) throw error1
                    if (results1["rows"][0]["Password"] == password) {
                        client.query('SELECT "User_ID" FROM "User" WHERE "UserName" = \'' + username + '\';', (error2, results2) => {
                            if (error2) throw error2
                            AuthUser = new Passer(results2["rows"][0]["User_ID"], null, null)
                            toRedirect = '/UserHomePage/' + AuthUser
                            res.redirect(toRedirect)
                        })
                    }
                })
            }
        }
    })
})

app.post("/failedLoginPage/submit", function (req, res) {
    var username = req.body.username
    var password = req.body.password
    client.query('SELECT "UserName" FROM "User";', (error, results) => {
        if (error) throw error
        for (let row of results.rows) {
            if (row["UserName"] == username) {
                client.query('SELECT "Password" FROM "User" WHERE "UserName" = \'' + username + '\';', (error1, results1) => {
                    if (error1) throw error1
                    console.log(results1["rows"][0]["Password"])
                    if (results1["rows"][0]["Password"] == password) {
                        res.redirect('/loginResult/' + username)
                    }
                })
            }
        }
    })
    res.redirect('/failedLoginPage')
})

app.post("/createNewUser/submit", function (req, res) {
    var username = req.body.username
    var password = req.body.password
    client.query('INSERT INTO "User"("UserName", "Password") VALUES(\'' + username + '\', \'' + password + '\');', (error, results) => {
        if (error) throw error
    })
    res.redirect('/loginPage')
})

app.post("/contact-submitted", function (req, res) {
    var cname = req.body.name;
    var cemail = req.body.email;
    var cmessage = req.body.message;
    var chuman = req.body.human;

    console.log(cname);
    console.log(cemail);
    console.log(cmessage);
    console.log(chuman);
});

app.post("/userform-submitted", function (req, res) {
    var uname = req.body.name;
    var uemail = req.body.email;
    var umessage = req.body.message;
    var uhuman = req.body.human;

    console.log(uname);
    console.log(uemail);
    console.log(umessage);
    console.log(uhuman);
});

app.post("/taskform-submitted", function (req, res) {
    var task = req.body.task;
    var taskOwner = req.body.taskOwner;
    var status = req.body.status;

    console.log(task);
    console.log(taskOwner);
    console.log(status);
});

app.post("/projectform-submitted", function (req, res) {
    project.crudProject(req, res);
    console.log('post method of project form');
    res.redirect('/');
});




//This server is running through the port 3000
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})