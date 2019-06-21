const express = require('express');

//Will need when integrate this with database and APIs
const bodyParser = require ('body-parser');

const main = __dirname;
const views = __dirname + '/views/';

//?? Required??
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000; //Talk to browser through this port

console.log("testing console");

app.get('/', (req,res)=>{
    //use sendFile since this is a simple html apage
    //__dirname attaches the file path of the server.js file. 
    //Since home.thml is in the same directory as server.js, there is nothing else to add to it.
    res.sendFile(main +'/index.html');
});

app.get('/login', (req,res)=>{
    //use sendFile since this is a simple html apage
    res.sendFile(main +'/userForm.html');
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

app.get("/taskform",function(req,res){
  res.sendFile(views + "taskForm.html");
});

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



const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});






//This server is running through the port 3000
app.listen(port,()=>{
    console.log(`Server is up on Port:${port}`);
}); 