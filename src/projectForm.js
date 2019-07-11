console.log('running projectForm.js')

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const pg = require('pg')
//const db = require('./queries')


//Connecting to cloud based database:
const { Client } = require('pg');

const client = new Client({

    connectionString: process.env.DATABASE_URL,
    //connectionString: "postgres://yyuppeulmuhcob:205438d2d30f5107605d7fa1c5d8cf4d667eaf0cb2b1608bf01cd4bb77f7bca5@ec2-54-221-212-126.compute-1.amazonaws.com:5432/deku7qrk30lh0",
    ssl: true,
});

client.connect();



//Will need when integrate this with database and APIs
const bodyParser = require('body-parser');
const app = express();
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, '../public/views/'));
app.set('view engine', 'html');

const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000; //Talk to browser through this port
const publicDirectoryPath = path.join(__dirname, '../public/')
const views = path.join(__dirname, '../public/views/')

app.use(express.static(publicDirectoryPath))
const getProject = (req, res) => {

    client.query('SELECT * FROM "Project";', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            // console.log(JSON.stringify(row));

        }
    });
};

// to insert , update and delete project
const crudProject = (req, res) => {
    var btnSubmit = req.body.submit;
    var btnUpdate = req.body.update;
    var btnDelete = req.body.delete;

    var projectName = req.body.project;
    var projectDesc = req.body.projectDetails;
    var userCreate = JSON.stringify(req.cookies.userInfo.userid)
    console.log(userCreate)
    var projectMembers = req.body.projectMembers
    var startDate = req.body.startDate;
    var dueDate = req.body.dueDate;
    var projectStatus = req.body.projectStatus;
    var status = 0;
    if (projectStatus == 'active')
        status = 1;


    if (btnSubmit) {
        console.log('----------------------------------create project button is clicked--------------------------------')

        const text = 'INSERT INTO "Project"("ProjectName", "ProjectDesc", "UserCreate", "StartDate", "DueDate", "Status") VALUES($1,$2,$3,$4,$5,$6) RETURNING *';
        const values = [projectName, projectDesc, userCreate, startDate, dueDate, status];
        // callback
        client.query(text, values, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0])
            }
            console.log('----------------------------------record is created--------------------------------');
        })
        // add user-project connection to AttachUserP table
        client.query('SELECT "Project_ID" FROM "Project" WHERE "ProjectName" = \''+projectName+'\';', (err1, projectidresult) => {
            if (err1) {console.log(err1.stack)}
            const attachValues = [userCreate, projectidresult["rows"][0]["Project_ID"]]
            const attachText = 'INSERT INTO "AttachUserP"("User_ID", "Project_ID") VALUES($1,$2) RETURNING *'
            client.query(attachText, attachValues, (err2, res2) => {
                if (err2) {console.log(err2.stack)}
                var newCookie = req.cookies.userInfo
                newCookie.projects.push(projectidresult["rows"][0]["Project_ID"]) // update cookie from req -> res to add the new project that the user is assigned to
                newCookie.projectNames.push(projectName)
                newCookie.projectDescs.push(projectDesc)
                res.cookie("userInfo", newCookie)
                res.redirect('/projectForm');
            })
        })
    }

    if (btnUpdate) {
        console.log('----------------------------------update project button is clicked--------------------------------')

        const updateOneQuery = `UPDATE "Project" SET "ProjectName"=$1,"ProjectDesc"=$2,"UserCreate"=$3, "StartDate"=$4, "DueDate"=$5, "Status"=$6 WHERE "Project_ID"=$7 returning *`;
        const values = [project, projectDesc, '5', startDate, dueDate, status,'6'];


        // callback
        client.query(updateOneQuery, values, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0])

            }

        })
        console.log('----------------------------------record is updated--------------------------------')
    }

    if (btnDelete) {
        console.log('----------------------------------delete project button is clicked--------------------------------')

        const deleteOneQuery = `DELETE FROM "Project" WHERE  "Project_ID"=$1 returning *`;
        const values = ['28'];


        // callback
        client.query(deleteOneQuery, values, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0])

            }

        });
        console.log('----------------------------------record is deleted--------------------------------')
    }
};

module.exports = {
    getProject,
    crudProject,
}