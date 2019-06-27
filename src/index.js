console.log('running index.js')

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const pg = require('pg')

// connect to database
var connectionString = 'postgres://yyuppeulmuhcob:205438d2d30f5107605d7fa1c5d8cf4d667eaf0cb2b1608bf01cd4bb77f7bca5@ec2-54-221-212-126.compute-1.amazonaws.com:5432/deku7qrk30lh0'
console.log(connectionString)
/*
pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT * FROM User', function(err, result) {
        done();
        if(err) return console.error(err);
        console.log(result.rows);
    });
});
*/

//Will need when integrate this with database and APIs
const bodyParser = require ('body-parser')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000; //Talk to browser through this port
const publicDirectoryPath = path.join(__dirname, '../public/')
const views = path.join(__dirname, '../public/views/')

app.use(express.static(publicDirectoryPath))

// When a user connects
// Connection event is built in
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ username, room }) => {
        socket.join(room)

        // Display only to connection
        socket.emit('message', generateMessage(`Welcome to ${room}!`))
        // Display to everyone but the connection
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined ${room}`))

        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
    })

    // Display to everyone
    socket.on('sendMessage', (message, callback) => {
        // const filter = new Filter()

        // if (filter.isProfane(message)) {
        //     return callback('Profanity is not allowed!')
        // }

        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    // When a user disconnects
    // Disconnect event is built in
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})

app.get('/', (req,res)=>{
    //use sendFile since this is a simple html apage
    //__dirname attaches the file path of the server.js file. 
    //Since home.thml is in the same directory as server.js, there is nothing else to add to it.
    res.sendFile(publicDirectoryPath +'/index.html');
});

app.get('/login', (req,res)=>{
    //use sendFile since this is a simple html apage
    res.sendFile(views +'userForm.html');
});

app.get("/about", function (req, res) {
    res.sendFile(views + "about.html");
});

app.get("/contact",function(req,res){
    res.sendFile(views + "contact.html");
});

app.get("/userform",function(req,res){
    res.sendFile(views + "userForm.html");
});
app.get("/projectform", function (req, res) {
    res.sendFile(views + "projectForm.html");

});
app.get("/jobstoryform", function (req, res) {
    res.sendFile(views + "jobStoryForm.html");

});
app.get("/taskform",function(req,res){
    res.sendFile(views + "taskForm.html");
});
app.get("/issueform", function (req, res) {
    res.sendFile(views + "issueForm.html");
});
app.get("/chatapp",function(req,res){
    res.sendFile(views + "chatApp.html")
})

app.get("/loginpage",function(req,res){
    res.sendFile(views + "loginPage.html")
})

app.get("/chatSignIn",function(req,res){
    res.sendFile(views + "chatSignIn.html")
})

app.get("/chatApp.html",function(req,res){
    res.sendFile(views + "chatApp.html")
})

app.post("/contact-submitted", function(req,res){
    var cname = req.body.name;
    var cemail = req.body.email;
    var cmessage = req.body.message;
    var chuman = req.body.human;

    console.log(cname);
    console.log(cemail);
    console.log(cmessage);
    console.log(chuman);
});

app.post("/userform-submitted", function(req,res){
    var uname = req.body.name;
    var uemail = req.body.email;
    var umessage = req.body.message;
    var uhuman = req.body.human;

    console.log(uname);
    console.log(uemail);
    console.log(umessage);
    console.log(uhuman);
});

app.post("/taskform-submitted", function(req,res){
    var task= req.body.task;
    var taskOwner = req.body.taskOwner;
    var status = req.body.status;

    console.log(task);
    console.log(taskOwner);
    console.log(status);
});






/*
 const { Client } = require('pg');

 const client = new Client({
   connectionString: process.env.DATABASE_URL,
   ssl: true,
 });

 client.connect();


 client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    console.log("SUCCESS: ALINA");
   if (err) throw err;
   for (let row of res.rows) {
     console.log(JSON.stringify(row));
   }
   client.end();
 });
*/
 

var pg = require('pg');

var connectionString = "postgres://yyuppeulmuhcob:205438d2d30f5107605d7fa1c5d8cf4d667eaf0cb2b1608bf01cd4bb77f7bca5@ec2-54-221-212-126.compute-1.amazonaws.com:5432/deku7qrk30lh0"


pg.connect(connectionString, function(err, client, done) {
client.query('SELECT * "AssignProject";', function(err, result) {
    console.log("Success: ALINA");
done();
if(err) return console.error(err);
console.log(result.rows);
});
});





// var pgp = require('pg-promise')(/*options*/);

// var cn = {
//    host: 'ec2-54-221-212-126.compute-1.amazonaws.com', // server name or IP address;
//    port: 5432,
//    database: 'deku7qrk30lh0',
//    user: 'yyuppeulmuhcob',
//    password: '205438d2d30f5107605d7fa1c5d8cf4d667eaf0cb2b1608bf01cd4bb77f7bca5'
// };
// // alternative:
// // var cn = 'postgres://username:password@host:port/database';

// var db = pgp(cn); // database instance;

// // select and return user name from id:
// db.one('SELECT table_schema,table_name FROM information_schema.tables;', 123)
//    .then(user => {
//        console.log(user.name); // print user name;
//    })
//    .catch(error => {
//        console.log(error); // print the error;
//    });






//This server is running through the port 3000
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})