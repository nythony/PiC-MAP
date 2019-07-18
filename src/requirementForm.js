console.log('running requirementForm.js')

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/usersAtChat')
const pg = require('pg')
//const db = require('./queries')


//Connecting to cloud based database:
const { Client } = require('pg');

const client = new Client({

    //connectionString: process.env.DATABASE_URL,
    connectionString: "postgres://yyuppeulmuhcob:205438d2d30f5107605d7fa1c5d8cf4d667eaf0cb2b1608bf01cd4bb77f7bca5@ec2-54-221-212-126.compute-1.amazonaws.com:5432/deku7qrk30lh0",
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
const getRequirement = (req, res) => {

    client.query('SELECT * FROM "Requirement";', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            // console.log(JSON.stringify(row));

        }
    });
};

// to insert , update and delete requirement
const crudRequirement = (req, res) => {
    var btnSubmit = req.body.submit;
    var btnUpdate = req.body.update;
    var btnDelete = req.body.delete;
    var projectID = req.body.projectID;
    var requirement = req.body.requirement;
    var requirementDesc = req.body.requirementDesc;
    var requirementCat = req.body.requirementCat;
    var requirementlbl = req.body.requirementlbl;

    var dueDate = req.body.dueDate;


    toRedirect = '/';


    if (btnSubmit) {
        console.log('----------------------------------create requirement button is clicked--------------------------------')

        const text = 'INSERT INTO "Requirement" ("Project_ID","RequirementName", "RequirementDesc", "RequirementCategrory", "RequirementLabel", "DueDate") VALUES($1, $2,$3,$4,$5,$6) RETURNING *';
        const values = [projectID, requirement, requirementDesc, requirementCat, requirementlbl, dueDate];
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
        console.log('----------------------------------update requirement button is clicked--------------------------------')

        const updateOneQuery = `UPDATE "Requirement" SET "Project_ID"=$1, "RequirementName"=$2, "RequirementDesc"=$3, "RequirementCategrory"=$4, "RequirementLabel"=$5, "DueDate"=$6 WHERE "Req_ID"=$7 returning *`;
        const values = ['1', requirement, requirementDesc, '5', '1', dueDate, '6'];


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
        console.log('----------------------------------delete requirement button is clicked--------------------------------')

        const deleteOneQuery = `DELETE FROM "Requirement" WHERE  "Req_ID"=$1 returning *`;
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
    getRequirement,
    crudRequirement,
}