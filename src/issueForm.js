console.log('running issueForm.js')

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
const getIssue = (req, res) => {

    client.query('SELECT * FROM "Issue";', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            // console.log(JSON.stringify(row));

        }
    });
};

// to insert , update and delete issue
const crudIssue = (req, res) => {
    var btnSubmit = req.body.submit;
    var btnUpdate = req.body.update;
    var btnDelete = req.body.delete;

    var projectID = req.body.projectID;
    var issue = req.body.issue;
    var issueDesc = req.body.issueDesc;
    var issueCat = req.body.issueCat;
    var issuelbl = req.body.issuelbl;

    var dueDate = req.body.dueDate;
    var priority = req.body.priority;
    var rootCause = req.body.rootCause;
    var resolution = req.body.resolution;
    var createDate = req.body.createDate;


    toRedirect = '/';


    if (btnSubmit) {
        console.log('----------------------------------create issue button is clicked--------------------------------')

        const text = 'INSERT INTO "Issue" ("Project_ID", "Priority", "IssueName", "IssueDesc", "DueDate", "IssueLabel", "IssueCategory", "RootCause", "Resolution", "CreateDate") VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *';
        const values = [projectID, priority, issue, issueDesc, dueDate, issuelbl, issueCat, rootCause, resolution, createDate];
        // callback
        client.query(text, values, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows[0])

            }
            console.log('----------------------------------record is created--------------------------------');
        })

    }

    if (btnUpdate) {
        console.log('----------------------------------update issue button is clicked--------------------------------')

        const updateOneQuery = `UPDATE "Issue" SET "Project_ID"=$1, "Priority"=$2, "IssueName"=$3, "IssueDesc"=$4, "DueDate"=$5, "IssueLabel"=$6, "IssueCategory"=$7, "RootCause"=$8, "Resolution"=$9, "CreateDate"=$10 WHERE "Issue_ID"=$11 returning *`;
        const values = [projectID, priority, issue, issueDesc, dueDate, issuelbl, issueCat, rootCause, resolution, createDate, '6'];


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
        console.log('----------------------------------delete issue button is clicked--------------------------------')

        const deleteOneQuery = `DELETE FROM "Issue" WHERE  "Issue_ID"=$1 returning *`;
        const values = ['6'];


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
    getIssue,
    crudIssue,
}