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








//This server is running through the port 3000
app.listen(port,()=>{
    console.log(`Server is up on Port:${port}`);
}); 