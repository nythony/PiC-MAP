// Login Tools

// Establish db connection from within loginTools
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    //connectionString: "postgres://yyuppeulmuhcob:205438d2d30f5107605d7fa1c5d8cf4d667eaf0cb2b1608bf01cd4bb77f7bca5@ec2-54-221-212-126.compute-1.amazonaws.com:5432/deku7qrk30lh0",
    ssl: true,
});
client.connect();

// verifyCredentials
// params - req, res from server, as well as username and password input by user
// uses db stored function "user_pass_match" and performs page redirect based on result
// this will change, but this is the dead branch version for now
const verifyCredentials = (req, res, username, password) => {
    var loginMatch = client.query('SELECT user_pass_match(\''+username+'\',\''+password+'\');').then()
    console.log('login return: ', loginMatch)
    client.query('SELECT "Project_ID" FROM "User" as Ur RIGHT JOIN "AttachUserP" AS Ap ON Ap."User_ID" = Ur."User_ID" WHERE Ur."UserName" = \'' + username + '\';', (error2, results2) => {
        if (error2) throw error2 //Should never happen, if anything it returns and stores null
        var storage = []
        for (let obj of results2.rows) {
            storage.push(obj["Project_ID"])
        }
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
                        projectDescs: pDescs, chatname: "TestingChatroom", chatroomid: 1, currProjectID: 0, currProjectName: null, taskTools: []});
                    toRedirect = '/UserHomePage/'
                    res.redirect(toRedirect)
                })
            })
        })
    })





}


module.exports = {
    verifyCredentials,
}