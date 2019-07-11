// Importing all things set up by project
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { Client } = require('pg')

const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
const url = require('url')

// Importing all things from other parts of project
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const project = require('./projectForm.js')
const requirement = require('./requirementForm.js')
const task = require('./taskForm.js')
const taskTool = require('./taskToolForm.js')
const issue = require('./issueForm.js')

//Connecting to cloud based database:
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    //connectionString: "postgres://yyuppeulmuhcob:205438d2d30f5107605d7fa1c5d8cf4d667eaf0cb2b1608bf01cd4bb77f7bca5@ec2-54-221-212-126.compute-1.amazonaws.com:5432/deku7qrk30lh0",
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


app.use(cookieParser());

// Trying to mask some user authentication
/* Getting rid of global variable and changing to cookie
class Passer {
    constructor(userid, projectid, taskid){
        this.userid = userid
        this.projectid = projectid
        this.taskid = taskid
    }
}
*/

// IO


// When a user connects
// Connection event is built in
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ username, userid, room, chatroomid }, callback) => {
        const { error, user} = addUser({ id: socket.id, username, userid, room, chatroomid })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        // Display only to connection
        client.query('SELECT * FROM "ChatMessage" AS t1 RIGHT JOIN "User" AS t2 ON t1."User_ID" = t2."User_ID" LEFT JOIN "ChatRoom" AS t3 ON t1."ChatRoom_ID" = t3."ChatRoom_ID" WHERE t3."ChatRoom_ID" = \'' + user.chatroomid + '\';', (error, results) => {
            for (let foo of results.rows) {
                //console.log(foo["Message"])
                //console.log("we're here")
                socket.emit('message', generateMessage(foo["UserName"], foo["Message"]))
            }
        })

        // socket.emit('message', generateMessage('Admin', `Welcome to ${room}!`))
        // Display to everyone but the connection
        // socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined ${room}`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    // Display to everyone
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const text = 'INSERT INTO "ChatMessage"( "User_ID", "ChatRoom_ID", "Message" ) VALUES($1, $2, $3) RETURNING *'
        const values = [user.userid, user.chatroomid, message]
        client.query(text, values, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0])

            }
            console.log('----------------------------------record is created--------------------------------')
        })
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
            // io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
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
    res.sendFile(publicDirectoryPath + 'views/loginPage.html');
})

// Login Page
app.get("/loginPage", function (req, res) { //Redirect to home page/login page, but only when specifically log out.
    res.clearCookie("userInfo");
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

// User Home Page GET request
app.get("/UserHomePage/", function (req, res) {
    console.log("Cookie: ", req.cookies.userInfo);
    res.render("UserHomePage", { user: req.cookies.userInfo })
})

// Project Home Page GET request
app.get("/ProjectHomePage/", function (req, res) {
    console.log("Cookie: ", req.cookies.userInfo);
    res.render("ProjectHomePage", { user: req.cookies.userInfo})
})


// Was using this to test some react stuff.
// app.get('/', function (req, res) {
//     res.sendfile(publicDirectoryPath + 'views/HelloWorld.html');
// })


// Current version of how to submit projects to db
app.get("/projectForm", function (req, res) {
    project.getProject(req, res);
    res.render("projectForm", { user: req.cookies.userInfo })
})

app.get("/requirementform", function (req, res) {
    requirement.getRequirement(req, res);
    res.sendFile(publicDirectoryPath + "views/requirementForm.html");
});
app.get("/taskform", function (req, res) {
    task.getTask(req, res);
    res.sendFile(publicDirectoryPath + "views/taskForm.html");
});
app.get("/taskToolform", function (req, res) {
    taskTool.getTaskTool(req, res);
    res.sendFile(publicDirectoryPath + "views/taskToolForm.html");
});

app.get("/issueform", function (req, res) {
    issue.getIssue(req, res);
    res.sendFile(publicDirectoryPath + "views/issueForm.html");
});

// Current version of chatApp (Must be updated)
app.get("/chatapp", function (req, res) {
    console.log(req)
    // req.query.username = "Jalapeno"
    // req.query.room = "Test"
    res.sendFile(publicDirectoryPath + "views/chatApp.html")
})

// Signin page for chatApp (Must be updated)
app.get("/chatSignIn", function (req, res) {
    res.sendFile(publicDirectoryPath + "views/chatSignIn.html")
})

app.post("/UserHomePage/chatapp", function (req, res) {
    console.log(req)
    res.sendFile(publicDirectoryPath + "views/chatApp.html")
})



// App.post stuff

// When user wants to navigate to create new user page - redirects to createNewUser
app.post("/loginPage/createNewUser", function (req, res) {
    res.redirect('/createNewUser')
})

// For use when logging out
app.post("/loginPage", function (req, res) {
    res.redirect('/loginPage')
})

// When user wants to navigate to create new user page from failedLoginPage - redirects to createNewUser
app.post("/failedLoginPage/createNewUser", function (req, res) {
    res.redirect('/createNewUser')
})

// When user wants to navigate to login page from createNewUser - redirects to loginPage
app.post("/createNewUser/login", function (req, res) {
    res.redirect('/loginPage')
})

// When user wants to navigate to projectForm page from UserHomePage
app.post("/UserHomePage/createProject", function (req, res) {
    res.redirect('/projectForm')
})

// When user wants to navigate to UserHomePage from projectForm
app.post("/projectForm/backToUserHomePage", function (req, res) {
    res.redirect('/UserHomePage/')
})

// When user wants to navigate to UserHomePage from ProjectHomePage (I actually don't think this is being used)
app.post("/ProjectHomePage/returnToUserHomePage", function (req, res) {
    res.redirect('/UserHomePage/')
})

// When user wants to navigate to UserHomePage from ProjectHomePage
app.post("/returnToUserHomePage", function (req, res) {
    res.redirect('/UserHomePage/')
})

// When user wants to navigate to taskToolForm from ProjectHomePage
app.post("/createTaskTool", function (req, res) {
    res.redirect('/taskToolForm/')
})

// When user wants to navigate to ProjectHomePage from taskToolForm
app.post("/taskToolForm/backToProjectHomePage", function (req, res) {
    res.redirect('/ProjectHomePage')
})


    // When user clicks button to join an existing project
app.post("/UserHomePage/joinProject", function (req, res) {
    var userid = JSON.stringify(req.cookies.userInfo.userid)
    var projectName = req.body.projectName
    client.query('SELECT "Project_ID", "ProjectDesc" FROM "Project" WHERE "ProjectName" = \''+projectName+'\';', (err1, projectresult) => { // get project ID of input project
        if (err1) {console.log(err1.stack)}
        const projectid = projectresult["rows"][0]["Project_ID"]
        const projectDesc = projectresult["rows"][0]["ProjectDesc"]
        const attachValues = [userid, projectid]
        const attachText = 'INSERT INTO "AttachUserP"("User_ID", "Project_ID") VALUES($1,$2) RETURNING *'
        client.query(attachText, attachValues, (err2, res2) => { // add new link to AttachUserP table
            if (err2) {console.log(err2.stack)}     // THIS NEEDS TO BE PUT INTO A refreshCookie() function
            var newCookie = req.cookies.userInfo
            newCookie.projects.push(projectid) // update cookie from req -> res to add the new project that the user is assigned to
            newCookie.projectNames.push(projectName)
            newCookie.projectDescs.push(projectDesc)
            res.cookie("userInfo", newCookie)
            res.redirect('/UserHomePage/');
        })
    })
})


    // TEMPORARY
    // When user clicks button to view a project
    app.post("/UserHomePage/viewProject", function (req, res) {
        var projectName = req.body.projectName
        client.query('SELECT "Project_ID" FROM "Project" WHERE "ProjectName" = \''+projectName+'\';', (err, projectidresult) => { // get project ID of input project
            var newCookie = req.cookies.userInfo
            const projectid = projectidresult["rows"][0]["Project_ID"]
            newCookie.currProjectID = projectid // update cookie for the input project
            newCookie.currProjectName = projectName
            console.log('projectid: ', projectid)
            client.query('SELECT "User_ID" FROM "AttachUserP" WHERE "Project_ID" = '+projectid+';', (err1, teamIDresult) => {
                var teamIDs = []
                for (let teammate of teamIDresult["rows"]){
                    teamIDs.push(teammate["User_ID"]) // get the IDs of the users associated with this project
                }
                var IDstring = '('
                var i;
                for (i = 0; i < teamIDs.length; i++) { // put in the form of (id1, id2, id3, ...), as this is needed for the IN query
                    IDstring += (teamIDs[i]).toString()
                    if (i != teamIDs.length-1) {
                        IDstring += ','
                    }
                }
                IDstring += ')'
                client.query('SELECT "UserName" FROM "User" WHERE "User_ID" IN '+IDstring+';', (err2, teamnameresult) => {
                    var teamNames = []
                    for (let teammate of teamnameresult["rows"]){ // get the names of all users whose IDs we have
                        teamNames.push(teammate["UserName"])
                    }
                    newCookie["teamIDs"] = teamIDs
                    newCookie["teamNames"] = teamNames
                    res.cookie("userInfo", newCookie)
                    res.redirect('/ProjectHomePage')
                })
            })
        })
    })


    // When user attempts to sign in
    // If successful, redirects to UserHomePage
    // If unsuccessful, redirects to failedLoginPage
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
                            client.query('SELECT "Project_ID" FROM "User" as Ur RIGHT JOIN "AttachUserP" AS Ap ON Ap."User_ID" = Ur."User_ID" WHERE Ur."UserName" = \'' + username + '\';', (error2, results2) => {
                                if (error2) throw error2 //Should never happen, if anything it returns and stores null
                                var storage = []
                                for (let obj of results2.rows) {
                                    storage.push(obj["Project_ID"])
                                }
                                res.cookie("userInfo", { name: username, pass: password, projects: storage });
                                toRedirect = '/UserHomePage/' // + AuthUser
                                client.query('SELECT "User_ID" FROM "User" WHERE "UserName" = \'' + username + '\';', (error1, useridresult) => {
                                    client.query('SELECT "Project_ID" FROM "User" as Ur RIGHT JOIN "AttachUserP" AS Ap ON Ap."User_ID" = Ur."User_ID" WHERE Ur."UserName" = \'' + username + '\';', (error2, results2) => {
                                        if (error2) throw error2 //Should never happen, if anything it returns and stores null
                                        var storage = []
                                        for (let obj of results2.rows){
                                            storage.push(obj["Project_ID"])
                                        }
                                        var IDstring = '('
                                        var i;
                                        for (i = 0; i < storage.length; i++) { // put in the form of (id1, id2, id3, ...), as this is needed for the IN query
                                            IDstring += (storage[i]).toString()
                                            if (i != storage.length-1) {
                                                IDstring += ','
                                            }
                                        }
                                        IDstring += ')'
                                        client.query('SELECT "ProjectName", "ProjectDesc" FROM "Project" WHERE "Project_ID" IN '+IDstring+';', (error3, projectnameresult) => {
                                            var pNames = []
                                            var pDescs = []
                                            for (let project of projectnameresult["rows"]){ // get the names of all users whose IDs we have
                                                pNames.push(project["ProjectName"])
                                                pDescs.push(project["ProjectDesc"])
                                            }
                                            res.cookie("userInfo",{name:username, userid: useridresult["rows"][0]["User_ID"], pass:password, projects: storage, projectNames: pNames, 
                                                projectDescs: pDescs, chatname: "TestingChatroom", chatroomid: 1, currProjectID: 0, currProjectName: null});
                                            toRedirect = '/UserHomePage/'
                                            res.redirect(toRedirect)
                                        })
                                    })
                                })
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
    });

    app.post("/createNewUser/submit", function (req, res) {
        var username = req.body.username
        var password = req.body.password
        client.query('INSERT INTO "User"("UserName", "Password") VALUES(\'' + username + '\', \'' + password + '\');', (error, results) => {
            if (error) throw error
        })
        res.redirect('/loginPage')
    });

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

    // When user clicks button to create new project (could be create, update, or delete)
    app.post("/projectform-submitted", function (req, res) {
        project.crudProject(req, res);
    });


    app.post("/requirementform-submitted", function (req, res) {
        requirement.crudRequirement(req, res);
        console.log('post method of requirement form');
        res.redirect('/');
    });

    app.post("/taskform-submitted", function (req, res) {
        task.crudTask(req, res);
        console.log('post method of task form');
        res.redirect('/');
    });
    app.post("/taskToolform-submitted", function (req, res) {
        taskTool.crudTaskTool(req, res);
        console.log('post method of taskTool form');
        res.redirect('/');
    });

    app.post("/issueform-submitted", function (req, res) {
        issue.crudIssue(req, res);
        console.log('post method of issue form');
        res.redirect('/');
    });

    //This server is running through the port 3000
    server.listen(port, () => {
        console.log(`Server is up on port ${port}!`)
    });