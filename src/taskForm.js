console.log('running taskForm.js')

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
const getTask = (req, res) => {

    client.query('SELECT * FROM "Task";', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            // console.log(JSON.stringify(row));

        }
    });
};

// to insert , update and delete task
const crudTask = (req, res) => {
    var btnSubmit = req.body.submit;
    var btnUpdate = req.body.update;
    var btnDelete = req.body.delete;

    var task = req.body.task;
    var taskDesc = req.body.taskDesc;
    var taskCat = req.body.taskCat;
    var tasklbl = req.body.tasklbl;

    var dueDate = req.body.dueDate;

    var priority = req.body.priority;
    var taskToolId = req.body.taskToolId;

    toRedirect = '/';


    if (btnSubmit) {
        console.log('----------------------------------create task button is clicked--------------------------------')

        const text = 'INSERT INTO "Task" ("TaskName", "TaskDesc", "TaskCategory", "TasksLabel", "DueDate","Priority","TaskTool_ID") VALUES($1, $2,$3,$4,$5,$6,$7) RETURNING *';
        const values = [task, taskDesc, taskCat, tasklbl, dueDate, priority, taskToolId];
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
        console.log('----------------------------------update task button is clicked--------------------------------')

        const updateOneQuery = `UPDATE "Task" SET "TaskName"=$1, "TaskDesc"=$2, "TaskCategory"=$3, "TasksLabel"=$4, "DueDate"=$5 ,"Priority"=$6 ,"TaskTool_ID"=$7 WHERE "Task_ID"=$8 returning *`;
        const values = [task, taskDesc, taskCat, tasklbl, dueDate, priority, taskToolId, '10'];


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
        console.log('----------------------------------delete task button is clicked--------------------------------')

        const deleteOneQuery = `DELETE FROM "Task" WHERE  "Task_ID"=$1 returning *`;
        const values = ['12'];


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
    getTask,
    crudTask,
}