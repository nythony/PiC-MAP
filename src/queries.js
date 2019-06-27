
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
        response.send(results)
    })
}


const createUser = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${result.insertId}`)
    })
}



module.exports = {
    getUsers,
    createUser,
}