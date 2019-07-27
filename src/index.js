// Importing all things set up by project
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { Client } = require('pg')

const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
const url = require('url')
const moment = require('moment')

// Importing all things from other parts of project
const { generateMessage, generateMessageHistory, generateTaskTool, generateSubtask} = require('./utils/messages')
const { addUserChat, removeUserChat, getUserChat, getUsersInRoomChat } = require('./utils/usersAtChat')
const { addUserTaskTool, removeUserTaskTool, getUserTaskTool, getUsersInTaskTool } = require('./utils/usersAtTaskTool')
const { addUserToProjectHomePage, removeUserFromProjectHomePage, getUserInProjectHomePage, getAllUsersInProjectHomePage } = require('./utils/usersAtProjectHomePage')
//const project = require('./projectForm.js')
// const requirement = require('./requirementForm.js')
// const task = require('./taskForm.js')
// const taskTool = require('./taskToolForm.js')
// const issue = require('./issueForm.js')
//const login = require('./loginTools.js')

//Connecting to cloud based database:
const client = new Client({
    //connectionString: process.env.DATABASE_URL,
    connectionString: "postgres://yyuppeulmuhcob:205438d2d30f5107605d7fa1c5d8cf4d667eaf0cb2b1608bf01cd4bb77f7bca5@ec2-54-221-212-126.compute-1.amazonaws.com:5432/deku7qrk30lh0",
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



// IO


// When a user connects
// Connection event is built in
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // ChatApp

    socket.on('joinChat', ({ username, userid, room, chatroomid, roomNumber }, callback) => {
        const { error, user} = addUserChat({ id: socket.id, username, userid, room, chatroomid, roomNumber })
        

        if (error) {
            return callback(error)
        }

        socket.join(user.roomNumber)
        //console.log(user)

        // Display only to connection
        client.query('SELECT t1."Message", t2."UserName", t1."TimeStamp" FROM "ChatMessage" AS t1 JOIN "User" AS t2 ON t1."User_ID" = t2."User_ID" JOIN "ChatRoom" AS t3 ON t1."ChatRoom_ID" = t3."ChatRoom_ID" WHERE t3."ChatRoom_ID" = \'' + user.chatroomid + '\' ORDER BY "ChatMessage_ID";', (error, results) => {
            for (let foo of results.rows) {
                //console.log(foo["Message"])
                //console.log("we're here")
                //console.log(foo)
                socket.emit('message', generateMessageHistory(foo["UserName"], foo["Message"], foo["TimeStamp"]))
            }
        })

        // socket.emit('message', generateMessage('Admin', `Welcome to ${room}!`))
        // Display to everyone but the connection
        // socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined ${room}`))
        io.to(user.roomNumber).emit('roomData', {
            room: user.room,
            users: getUsersInRoomChat(user.roomNumber)
        })

        callback()
    })

    // Display to everyone
    socket.on('sendMessage', (message, callback) => {
        const user = getUserChat(socket.id)
        const text = 'INSERT INTO "ChatMessage"( "User_ID", "ChatRoom_ID", "Message" ) VALUES($1, $2, $3) RETURNING *'
        const values = [user.userid, user.chatroomid, message]
        client.query(text, values, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                //console.log(res.rows[0])

            }
            console.log('----------------------------------record is created--------------------------------')
        })
        console.log(user.roomNumber)
        io.to(user.roomNumber).emit('message', generateMessage(user.username, message))
        // We can use this below for redirecting!
        // var destination = ('/loginPage')
        // io.to(user.room).emit('redirect', destination)
        callback()
    })


    // When a user disconnects
    // Disconnect event is built in
    socket.on('disconnect', () => {
        const user = removeUserChat(socket.id)
        const userTaskTool = removeUserTaskTool(socket.id)
        const userLeavingProjectHomePage = removeUserFromProjectHomePage(socket.id)
        if (user) {
            // io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.roomNumber).emit('roomData', {
                room: user.room,
                users: getUsersInRoomChat(user.roomNumber)
            })
        }
    })

    // Project Home Page

    // When a user enters a projecthomepage
    socket.on('enterProjectHomePage',  ({usernameVP, useridVP, projectNameVP, projectidVP}, callback) => {
        // Display only to connection
        client.query('SELECT "Project_ID" FROM "Project" WHERE "ProjectName" = \''+projectNameVP+'\';', (err, projectidresult) => { // get project ID of input project
            projectidVP = projectidresult["rows"][0]["Project_ID"]
            const { error, user} = addUserToProjectHomePage({ id: socket.id, usernameVP, useridVP, projectNameVP, projectidVP }) // register user on page
            if (error) {
                return callback(error)
            }
            socket.join((user.projectidVP).toString() + user.projectNameVP) // CHATROOM NAMING CONVENTION - ID + name (e.g. 8Twitter)
            client.query('SELECT "TaskToolName" FROM "TaskTool" WHERE "Project_ID" = '+projectidVP+';', (err3, tasktoolresult) => { // get all task tools for that project ID
                for (let foo of tasktoolresult.rows) {
                    socket.emit('taskTool', generateTaskTool(foo["TaskToolName"])) // display all task tools to user who just joined
                }
            })
        })
        //socket.emit('projectData', {projectname: user.projectNameVP, users: getAllUsersInProject(user.projectNameVP)})
        callback()
    })

    // When a new task tool is created with in ProjectHomePage
    socket.on('newTaskTool', ({taskToolProjectID, taskToolProjectName, taskTool}, callback) => {
        const text = 'INSERT INTO "TaskTool"( "Project_ID", "TaskToolName" ) VALUES($1, $2) RETURNING *'
        const values = [taskToolProjectID, taskTool]
        client.query(text, values, (err, res) => { // add taskTool to database
            io.in(taskToolProjectID.toString()+taskToolProjectName).emit('taskTool', generateTaskTool(taskTool)) // emit the new task tool to all user in room (room identifier is projectid+projectname)
            callback()
        })
    })

    

////////////////////
//  UserHomePage  //
////////////////////


    // When a user enters a userhomepage
    socket.on('enterUserHomePage',  (userProj, callback) => { 
        var username = userProj.username;
        var list = []//[username]

        const text = 'SELECT Pa."Project_ID", Pa."ProjectName", Pa."ProjectDesc" FROM "Project" Pa JOIN "AttachUserP" Ap ON Ap."Project_ID" = Pa."Project_ID" JOIN "User" Up ON Up."User_ID" = Ap."User_ID" WHERE "UserName" = \'' + username + '\' ORDER BY "StartDate"'

        client.query(text, (err, results) => { 
            for (let obj of results.rows){
                var proj = {}
                proj['Project_ID'] = obj["Project_ID"]
                proj['projectName'] = obj["ProjectName"]
                proj['projectDesc'] = obj["ProjectDesc"]
                
                list.push(proj);
            }
            socket.emit('projectList', list)
        })
    })


    // Creating a new project in the userHomePage
    socket.on('createProject', ({name, desc, start, due, user}, callback) => {

        //Convert username to userID
        var promise1 = new Promise(function(resolve, reject) {
            
            client.query('SELECT "User_ID" FROM "User" WHERE "UserName" = \''+user+'\';', (err, res) => {
                if (err) {
                    console.log(err.stack)
                } else {
                    const userCreate = res.rows[0].User_ID;
                    resolve(userCreate)
                }
            })
        });

        //Creating new project
        promise1.then(function(userCreate) {

            //Converting empty date to null values to enter into date type values in DB
            if (start == ""){
                start = null //Inserting allows for null entry. DB trigger to automatically set start date as current date. Due date is null
            }

            if (due == ""){
                due = null
            }

            //Inserting into database
            const text = 'INSERT INTO "Project"("ProjectName", "ProjectDesc", "UserCreate", "StartDate", "DueDate") VALUES($1,$2,$3,$4,$5) RETURNING *';
            const values = [name, desc, userCreate, start, due];

            client.query(text, values, (err, res) => {
                if (err) {
                    console.log(err.stack)
                } else {
                    console.log(res.rows[0])
                    console.log('----------------------------------project is created--------------------------------');
                    //socket.emit("projectList") --NEED TO UPDATE LIST SHOWN
                }

           });
        })
        callback()
    })



    // Editing a project from the userHomePage
    socket.on('editProject', (proj, callback) => {
        var start = proj.start;
        var due = proj.due;

        //Can just require each field and use last const text query statement


        //Do not edit start and due date
        if ((start == "") && (due == "")){
            const text = 'UPDATE "Project" SET "ProjectName" = \'' + proj.name + '\', "ProjectDesc" = \''+ proj.desc+ '\' WHERE "Project_ID" = \'' + proj.id + '\';'

        //Do not edit start, edit due
        } else if ( start == ""){
            const text = 'UPDATE "Project" SET "ProjectName" = \'' + proj.name + '\', "ProjectDesc" = \''+ proj.desc+ '\', "DueDate" = \'' + due + '\' WHERE "Project_ID" = \'' + proj.id + '\';'

        //Edit start, do not edit due  
        } else if (due == ""){
            const text = 'UPDATE "Project" SET "ProjectName" = \'' + proj.name + '\', "ProjectDesc" = \''+ proj.desc+ '\', "StartDate" = \'' + start + '\' WHERE "Project_ID" = \'' + proj.id + '\';'

        //Edit both start and due
        } else { 
            const text = 'UPDATE "Project" SET "ProjectName" = \'' + proj.name + '\', "ProjectDesc" = \''+ proj.desc+ '\', "StartDate" = \'' + start + '\', "DueDate" = \'' + due + '\' WHERE "Project_ID" = \'' + proj.id + '\';'
        }
        

        client.query(text, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log('----------------------------------project is modified--------------------------------');


                var username = proj.user
                    var list = [username]
                    const text = 'SELECT Pa."Project_ID", Pa."ProjectName", Pa."ProjectDesc" FROM "Project" Pa JOIN "AttachUserP" Ap ON Ap."Project_ID" = Pa."Project_ID" JOIN "User" Up ON Up."User_ID" = Ap."User_ID" WHERE "UserName" = \'' + username + '\' ORDER BY "StartDate"'
                    client.query(text, (err, results) => { 
                        for (let obj of results.rows){
                            var proj = {}
                            proj['projID'] = obj["Project_ID"]
                            proj['projName'] = obj["ProjectName"]
                            proj['projDesc'] = obj["ProjectDesc"]
                            
                            list.push(proj);
                        }
                        socket.emit('projectList', list)
                    })

            }
            
        })

        callback()
    })



    // Deleting project from the userHomePage
    socket.on('deleteProject', ({name, id, user}, callback) => {

        var obj = []
        obj.push(user)

        
        //Verification of project name entry
        var promise1 = new Promise(function(resolve, reject) {
            
            client.query('SELECT "Project_ID" FROM "Project" WHERE "ProjectName" = \''+name+'\';', (err, res) => {
                if (err) {
                    console.log(err.stack)
                } else {

                    if (res.rows.length != 0){
                        if (res.rows[0].Project_ID == id){ //Project_ID does not exist in res.rows if no match, so cannot combine with above statement
                            obj.push(id)
console.log("Before resolve", id, obj)
                            resolve(obj)
                        } else {
                            //Entered a project name, but with the wrong button
                            socket.emit("deleteProjectFail", "Invalid Project Name"); 
                            //Message should be kept the same because we query by projectID, which could be another user's project if mistyped
                        }
                    } else {
                        //Project name does not exist
                        socket.emit("deleteProjectFail", "Invalid Project Name");
                    }

                }
            })
        });

        //Creating new project
        promise1.then(function(obj) {


            const text = 'DELETE FROM "Project" WHERE "Project_ID"= \'' + id + '\';'
            client.query(text, (err, res) => {
                if (err) {
                    console.log(err.stack)
                } else {
                    console.log('----------------------------------project has been deleted--------------------------------');
                    
                    //Displaying project list again
                    var username = obj[0]
                    var list = []//[username]
                    const text = 'SELECT Pa."Project_ID", Pa."ProjectName", Pa."ProjectDesc" FROM "Project" Pa JOIN "AttachUserP" Ap ON Ap."Project_ID" = Pa."Project_ID" JOIN "User" Up ON Up."User_ID" = Ap."User_ID" WHERE "UserName" = \'' + username + '\' ORDER BY "StartDate"'
                    client.query(text, (err, results) => { 
                        for (let obj of results.rows){
                            var proj = {}
                            proj['Project_ID'] = obj["Project_ID"]
                            proj['ProjName'] = obj["ProjectName"]
                            proj['ProjDesc'] = obj["ProjectDesc"]
                            
                            list.push(proj);
                        }
                        socket.emit('projectList', list)
                        //All those subsequent users inside project need to be redirected
                    })
                }

           });

        })

        callback()
    })



    // Task Tool

    socket.on('joinTaskTool', ({ username, userid, roomNumber, TaskToolName, TaskTool_ID }, callback) => {
        const {error, user} = addUserTaskTool({ id: socket.id, username, userid, roomNumber, TaskToolName, TaskTool_ID })

        if (error) {
            return callback(error)
        }

        // console.log(user)

        socket.join(user.roomNumber)

        // Display subtasks
        client.query('SELECT * FROM "Task" AS t1 JOIN "TaskCategory" AS t2 ON t1."Category_ID" = t2."Category_ID" WHERE t1."TaskTool_ID" = \'' + user.TaskTool_ID + '\' ORDER BY "DueDate";', (error, results) => {
            const subtasks = []
            var subtaskusers = []
            for (let foo of results.rows) {
                client.query('SELECT t1."UserName" FROM "User" AS t1 JOIN "AttachUserT" AS t2 ON t1."User_ID" = t2."User_ID" WHERE t2."Task_ID" = \'' + foo["Task_ID"] + '\' ORDER BY "UserName";', (error, results2) => {
                    for (let foo2 of results2.rows) {
                        subtaskusers.push(foo2["UserName"])
                    }
                    if (results2.rows.length < 1)
                    {
                        subtaskusers.push("No users assigned")
                    }
                    const subtask = { TaskName: foo["TaskName"] , TaskDesc: foo["TaskDesc"], TaskUsers: subtaskusers.toString().replace(/,/g , ", "), DueDate: moment(foo["DueDate"]).format('dddd MM/DD/YY HH:mm'), TasksLabel: foo["TasksLabel"], TaskCategory: foo["CategoryName"], Task_ID: foo["Task_ID"], Task_ID2: foo["Task_ID"] }
                    subtasks.push(subtask)
                    subtaskusers.length = 0
                    //console.log(subtasks)
                    io.to(user.roomNumber).emit('subtask', (subtasks))
                })
            }
        })
        callback()
    })

    socket.on('createSubTask', ({TaskName, TaskDesc, DueDate, TaskTool_ID}, callback) => {
        const user = getUserTaskTool(socket.id)
        const text = 'INSERT INTO "Task"( "TaskName", "TaskDesc", "DueDate", "TaskTool_ID" ) VALUES($1, $2, $3, $4) RETURNING *'
        const values = [TaskName, TaskDesc, DueDate, TaskTool_ID]
        client.query(text, values, (err, res) => {
            if (err) {
                console.log(err.stack)
            }
            else {
                //console.log(res.rows[0])
            }
            console.log('----------------------------------record is created--------------------------------')
        })
        client.query('SELECT * FROM "Task" WHERE "TaskTool_ID" = \'' + TaskTool_ID + '\' ORDER BY "DueDate";', (error, results) => {
            const subtasks = []
            var subtaskusers = []
            for (let foo of results.rows) {
                client.query('SELECT t1."UserName" FROM "User" AS t1 JOIN "AttachUserT" AS t2 ON t1."User_ID" = t2."User_ID" WHERE t2."Task_ID" = \'' + foo["Task_ID"] + '\' ORDER BY "UserName";', (error, results2) => {
                    for (let foo2 of results2.rows) {
                        subtaskusers.push(foo2["UserName"])
                    }
                    if (results2.rows.length < 1)
                    {
                        subtaskusers.push("No users assigned")
                    }
                    const subtask = { TaskName: foo["TaskName"] , TaskDesc: foo["TaskDesc"], TaskUsers: subtaskusers.toString().replace(/,/g , ", "), DueDate: moment(foo["DueDate"]).format('dddd MM/DD/YY HH:mm'), TasksLabel: foo["TasksLabel"], TaskCategory: foo["CategoryName"], Task_ID: foo["Task_ID"], Task_ID2: foo["Task_ID"] }
                    subtasks.push(subtask)
                    subtaskusers.length = 0
                    //console.log(subtasks)
                    io.to(user.roomNumber).emit('subtask', (subtasks))
                })
            }
        })
        callback()
    })

    socket.on('editSubTask', ({TaskName, TaskDesc, DueDate, TaskTool_ID, Task_ID}, callback) => {
        const user = getUserTaskTool(socket.id)
        const text = 'UPDATE "Task" SET "TaskName"=$1, "TaskDesc"=$2, "DueDate"=$3 WHERE "Task_ID" = \'' + Task_ID + '\' RETURNING *'
        const values = [TaskName, TaskDesc, DueDate]
        client.query(text, values, (err, res) => {
            if (err) {
                console.log(err.stack)
            }
            else {
                //console.log(res.rows[0])
            }
            console.log('----------------------------------record is updated--------------------------------')
        })
        client.query('SELECT * FROM "Task" WHERE "TaskTool_ID" = \'' + TaskTool_ID + '\' ORDER BY "DueDate";', (error, results) => {
            const subtasks = []
            var subtaskusers = []
            for (let foo of results.rows) {
                client.query('SELECT t1."UserName" FROM "User" AS t1 JOIN "AttachUserT" AS t2 ON t1."User_ID" = t2."User_ID" WHERE t2."Task_ID" = \'' + foo["Task_ID"] + '\' ORDER BY "UserName";', (error, results2) => {
                    for (let foo2 of results2.rows) {
                        subtaskusers.push(foo2["UserName"])
                    }
                    if (results2.rows.length < 1)
                    {
                        subtaskusers.push("No users assigned")
                    }
                    const subtask = { TaskName: foo["TaskName"] , TaskDesc: foo["TaskDesc"], TaskUsers: subtaskusers.toString().replace(/,/g , ", "), DueDate: moment(foo["DueDate"]).format('dddd MM/DD/YY HH:mm'), TasksLabel: foo["TasksLabel"], TaskCategory: foo["CategoryName"], Task_ID: foo["Task_ID"], Task_ID2: foo["Task_ID"] }
                    subtasks.push(subtask)
                    subtaskusers.length = 0
                    //console.log(subtasks)
                    io.to(user.roomNumber).emit('subtask', (subtasks))
                })
            }
        })
        callback()
    })

    socket.on('deleteSubTask', ({TaskTool_ID, Task_ID}, callback) => {
        const user = getUserTaskTool(socket.id)
        const text = 'DELETE FROM "Task" WHERE "Task_ID"=$1 RETURNING *'
        const values = [Task_ID]
        client.query(text, values, (err, res) => {
            if (err) {
                console.log(err.stack)
            }
            else {
                //console.log(res.rows[0])
            }
            console.log('----------------------------------record is deleted--------------------------------')
        })
        client.query('SELECT * FROM "Task" WHERE "TaskTool_ID" = \'' + TaskTool_ID + '\' ORDER BY "DueDate";', (error, results) => {
            const subtasks = []
            var subtaskusers = []
            for (let foo of results.rows) {
                client.query('SELECT t1."UserName" FROM "User" AS t1 JOIN "AttachUserT" AS t2 ON t1."User_ID" = t2."User_ID" WHERE t2."Task_ID" = \'' + foo["Task_ID"] + '\' ORDER BY "UserName";', (error, results2) => {
                    for (let foo2 of results2.rows) {
                        subtaskusers.push(foo2["UserName"])
                    }
                    if (results2.rows.length < 1)
                    {
                        subtaskusers.push("No users assigned")
                    }
                    const subtask = { TaskName: foo["TaskName"] , TaskDesc: foo["TaskDesc"], TaskUsers: subtaskusers.toString().replace(/,/g , ", "), DueDate: moment(foo["DueDate"]).format('dddd MM/DD/YY HH:mm'), TasksLabel: foo["TasksLabel"], TaskCategory: foo["CategoryName"], Task_ID: foo["Task_ID"], Task_ID2: foo["Task_ID"] }
                    subtasks.push(subtask)
                    subtaskusers.length = 0
                    //console.log(subtasks)
                    io.to(user.roomNumber).emit('subtask', (subtasks))
                })
            }
        })
        callback()
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
// app.get("/failedLoginPage", function (req, res) {
//     res.sendFile(publicDirectoryPath + "views/failedLoginPage.html")
// })

// When createNewUser is loaded - sends createNewUser.html --DELETE
// app.get("/createNewUser", function (req, res) {
//     res.sendFile(publicDirectoryPath + "views/createNewUser.html")
// })

// User Home Page GET request
app.get("/UserHomePage/", function (req, res) {
    var username = req.query.username
    var password = req.query.password
    
    var loginMatch = client.query('SELECT user_pass_match(\''+username+'\',\''+password+'\');')
    loginMatch.then(function(result) {
        loginMatch = result.rows[0]["user_pass_match"]
        if (loginMatch == 1) { // successful login
            client.query('SELECT "User_ID" FROM "User" WHERE "UserName" = \'' + username + '\';', (error1, useridresult) => {
                var thisUserID = useridresult["rows"][0]["User_ID"]
                res.cookie("userInfo",{name:username, userid: thisUserID, chatname: "TestingChatroom", chatroomid: 1})
                res.render("UserHomePage", { user: req.cookies.userInfo })
               //Are we only using cookie to display username?
            })
        } else if (loginMatch == 2) { //username exists, bad password
            io.sockets.emit('failedLogin', 'Login unsuccessful: Wrong password')
        }
        else { // loginMatch == 3, username does not exist
            io.sockets.emit('failedLogin', 'Login unsuccessful: Username does not exist')
        } 
    })    
})

// Project Home Page GET request
app.get("/ProjectHomePage/", function (req, res) {
    var projectName = req.query.projectNameVP
    client.query('SELECT "Project_ID" FROM "Project" WHERE "ProjectName" = \''+projectName+'\';', (err, projectidresult) => { // get project ID of input project
        var newCookie = req.cookies.userInfo // duplicate cookie
        const projectid = projectidresult["rows"][0]["Project_ID"]
        newCookie["currProjectName"] = projectName
        newCookie["currProjectID"] = projectid // update cookie for the input project
        client.query('SELECT "ChatRoom_ID","ChatName" FROM "ChatRoom" WHERE "Project_ID" = \''+projectid+'\';', (err1, chatresult) => { // get chatroom name and id for this project
            const chatID = chatresult["rows"][0]["ChatRoom_ID"]
            const chatName = chatresult["rows"][0]["ChatName"]
            newCookie["chatroomid"] = chatID
            newCookie["chatname"] = chatName // update cookie, put new cookie in response, and finish
            const roomNumber = "C" + chatID.toString()
            newCookie["roomNumber"] = roomNumber
            res.cookie("userInfo", newCookie)
            req.query.projectidVP = projectid
            res.render(publicDirectoryPath + "views/ProjectHomePage.html", { user: req.cookies.userInfo })
        })
        
    })
})


// Was using this to test some react stuff.
// app.get('/', function (req, res) {
//     res.sendfile(publicDirectoryPath + 'views/HelloWorld.html');
// })


// Current version of how to submit projects to db --EDIT DELETE
// app.get("/projectForm", function (req, res) {
//     project.getProject(req, res);
//     res.render("projectForm", { user: req.cookies.userInfo })
// })

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
    res.sendFile(publicDirectoryPath + "views/chatApp.html")
})

app.get("/TaskTool", function (req, res) {
    res.sendFile(publicDirectoryPath + "views/TaskTool.html")
})


// App.post stuff

// When user wants to navigate to create new user page - redirects to createNewUser --DELETE
// app.post("/loginPage/createNewUser", function (req, res) {
//     res.redirect('/createNewUser')
// })

// For use when logging out
app.post("/logout", function (req, res) {
    res.redirect('/loginPage')
})

// When user wants to navigate to create new user page from failedLoginPage - redirects to createNewUser --DELETE
// app.post("/failedLoginPage/createNewUser", function (req, res) {
//     res.redirect('/createNewUser')
// })

// When user wants to navigate to login page from createNewUser - redirects to loginPage --DELETE
// app.post("/createNewUser/login", function (req, res) {
//     res.redirect('/loginPage')
// })

// When user wants to navigate to projectForm page from UserHomePage --EDIT DELETE
// app.post("/UserHomePage/createProject", function (req, res) {
//     res.redirect('/projectForm')
// })

// When user wants to navigate to UserHomePage from projectForm --EDIT DELETE (currently if you submit project form you get redirected here)
app.post("/projectForm/backToUserHomePage", function (req, res) {
    res.redirect('/UserHomePage/')
})

// When user wants to navigate to UserHomePage from ProjectHomePage (I actually don't think this is being used) Do we just need a button for this?
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
    res.redirect('/ProjectHomePage/')
})

// When user returns to ProjectHomePage (added this because of an error when trying to navigate back to ProjectHomePage after creating a taskTool)
app.post("/backToProjectHomePage", function (req, res) {
    res.redirect('/ProjectHomePage/')
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


/* I DON'T THINK THIS POST IS EVER CALLED !
// TEMPORARY
// When user clicks button to view a project
app.post("/UserHomePage/ProjectHomePage", function (req, res) {
    console.log("query: ", req.query)
    var projectName = req.body.projectNameVP
    client.query('SELECT "Project_ID" FROM "Project" WHERE "ProjectName" = \''+projectName+'\';', (err, projectidresult) => { // get project ID of input project
        var newCookie = req.cookies.userInfo
        const projectid = projectidresult["rows"][0]["Project_ID"]
        newCookie["currProjectID"] = projectName
        newCookie["currProjectID"] = projectid // update cookie for the input project
        client.query('SELECT "User_ID" FROM "AttachUserP" WHERE "Project_ID" = '+projectid+';', (err1, teamIDresult) => {
            var teamIDs = []
            for (let teammate of teamIDresult["rows"]) {
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
                client.query('SELECT "TaskToolName" FROM "TaskTool" WHERE "Project_ID" = '+projectid+';', (err3, tasktoolresult) => {
                    var taskToolNames = []
                    for (let tTool of tasktoolresult["rows"]) {
                        taskToolNames.push(tTool["TaskToolName"])
                    }
                    newCookie["taskTools"] = taskToolNames
                    res.cookie("userInfo", newCookie)
                    res.redirect('/ProjectHomePage')
                })
            })
        })
    })
})
*/


// When user attempts to sign in
// // If successful, redirects to UserHomePage
// // If unsuccessful, redirects to failedLoginPage
// app.post("/loginPage", function (req, res) { //--EDIT DELETE
//     var username = req.body.username
//     var password = req.body.password
    
//     var loginMatch = client.query('SELECT user_pass_match(\''+username+'\',\''+password+'\');')
//     loginMatch.then(function(result) {
//         loginMatch = result.rows[0]["user_pass_match"]
//         if (loginMatch == 1) { // successful login
//             client.query('SELECT "User_ID" FROM "User" WHERE "UserName" = \'' + username + '\';', (error1, useridresult) => {
//                 var thisUserID = useridresult["rows"][0]["User_ID"]
//                 res.cookie("userInfo",{name:username, userid: thisUserID, chatname: "TestingChatroom", chatroomid: 1})
//                 res.redirect("UserHomePage")
//             })
//         } else if (loginMatch == 2) { //username exists, bad password
//             io.sockets.emit('failedLogin', 'Login unsuccessful: Wrong password')
//         }
//         else { // loginMatch == 3, username does not exist
//             io.sockets.emit('failedLogin', 'Login unsuccessful: Username does not exist')
//         } 
//     })           
// })





//PUT VERIFY CREDENTIALS HERE AND ADD SOCKET FOR FAILED LOGIN.



// app.post("/failedLoginPage/submit", function (req, res) {  //--EDIT DELETE
//     var username = req.body.username
//     var password = req.body.password
//     client.query('SELECT "UserName" FROM "User";', (error, results) => {
//         if (error) throw error
//         for (let row of results.rows) {
//             if (row["UserName"] == username) {
//                 client.query('SELECT "Password" FROM "User" WHERE "UserName" = \'' + username + '\';', (error1, results1) => {
//                     if (error1) throw error1
//                     console.log(results1["rows"][0]["Password"])
//                     if (results1["rows"][0]["Password"] == password) {
//                         res.redirect('/loginResult/' + username)
//                     }
//                 })
//             }
//         }
//     })
//     res.redirect('/failedLoginPage')
// });

app.post("/createNewUser/submit", function (req, res) { //--EDIT DELETE
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

// When user clicks button to create new project (could be create, update, or delete) --EDIT DELETE, goes to socket instead
// app.post("/projectform-submitted", function (req, res) {
//     project.crudProject(req, res);
// });


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

// When user clicks button to create new task tool (could be create, update, or delete)
app.post("/taskToolform-submitted", function (req, res) {
    taskTool.crudTaskTool(req, res);
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