const express = require('express');

//Will need when integrate this with database and APIs
const bodyParser = require ('body-parser');

//?? Required??
var app = express();

const port = process.env.PORT || 3000; //Talk to browser through this port

app.get('/', (req,res)=>{
    //use sendFile since this is a simple html page
    res.sendFile(__dirname+'/home.html');
});

app.get('/userForm', (req,res)=>{
    //use sendFile since this is a simple html apage
    res.sendFile(__dirname+'/userForm.html');
});

app.get('/taskForm', (req,res)=>{
    //use sendFile since this is a simple html apage
    res.sendFile(__dirname+'/taskForm.html');
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






//This server is running through the port 3000
app.listen(port,()=>{
    console.log(`Server is up on Port:${port}`);
}); 