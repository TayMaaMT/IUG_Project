const Pool = require('pg').Pool
require('dotenv').config();
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
})

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err)
    }
    client.query('SELECT NOW()', (err, result) => {
        release()
        if (err) {
            return console.error('Error executing query', err.stack)
        }
        console.log(result.rows)
    })
})

// CREATE TABLE posts(
// 	id serial PRIMARY KEY,
// 	content text ,
//         picture VARCHAR ( 200 ) ,
//         user_id integer NOT NULL references users(id) ,
//         name VARCHAR ( 100 ) NOT NULL,
//         postType VARCHAR ( 100 ) ,
//         numbercomments integer DEFAULT 0,
//         numberlikes integer DEFAULT 0
// ); 

// CREATE TABLE comments(
// 	id serial PRIMARY KEY,
// 	content text ,
//         user_id integer NOT NULL references users(id) ,
//         name VARCHAR ( 100 ) NOT NULL,
//         post_id integer NOT NULL references posts(id) 

// );
// CREATE TABLE likes(
// 	id serial PRIMARY KEY,
//         userID integer NOT NULL references users(id) ,
//         name VARCHAR ( 100 ) NOT NULL,
//         post_id integer NOT NULL references posts(id) 

// );

module.exports = {
    query: (text, params) => pool.query(text, params),
}