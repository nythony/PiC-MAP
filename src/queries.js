
//Connecting to cloud based database:
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect();



const getUsers = (request, response) => {
    client.query('SELECT * FROM User', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
        console.log(results.rows)
    })
}



module.exports = {
    getUsers,
}