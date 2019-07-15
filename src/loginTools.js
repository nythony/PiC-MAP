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
const verifyCredentials = (req, res, username, password) => {
    //checkDatabase(req, res, username, password, loginRedirect)
    var loginMatch = client.query('SELECT user_pass_match(\''+username+'\',\''+password+'\');')
    loginMatch.then(function(result) {
        loginMatch = result.rows[0]["user_pass_match"]
        if (loginMatch == 1) { // successful login
            client.query('SELECT "User_ID" FROM "User" WHERE "UserName" = \'' + username + '\';', (error1, useridresult) => {
                var thisUserID = useridresult["rows"][0]["User_ID"]
                res.cookie("userInfo",{name:username, userid: thisUserID, chatname: "TestingChatroom", chatroomid: 1})
                res.redirect("/UserHomePage/")
            })
        } else if (loginMatch == 2) { //username exists, bad password
            res.redirect("/")
        }
        else { // loginMatch == 3, username does not exist
            res.redirect("/")
        }
    })
}


// CALLBACK EXAMPLE

/*
function checkDatabase(req, res, username, password, callback) {
    var userPassMatch = client.query('SELECT user_pass_match(\''+username+'\',\''+password+'\');')
    userPassMatch.then(function(result) {
        loginMatch = result.rows[0]["user_pass_match"]
        callback(req, res, username, loginMatch)
    })
}


function loginRedirect(req, res, username, loginMatch) {
    console.log('login return: ', loginMatch)
    if (loginMatch == 1) { // successful login
        res.cookie("userInfo",{name:username})
        res.redirect("/UserHomePage/")
    } else if (loginMatch == 2) { //username exists, bad password
        res.redirect("/")
    }
    else { // loginMatch == 3, username does not exist
        res.redirect("/")
    }
}
*/



module.exports = {
    verifyCredentials,
}