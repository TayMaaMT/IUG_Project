const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { CreatQuery, SelectQuerytable, UpdateQuerytable, DeletQuerytable } = require('../config/CRUD');

const creat = async(table, data) => {
    try {
        const colval = Object.keys(data).map(function(key) {
            return data[key];
        });
        const QueryUser = CreatQuery(table, data);
        const { rows } = await db.query(`${QueryUser}`, colval);
        return rows[0].id;
    } catch (err) {
        console.log(err);
        throw err;
    }
}


const find = async(table,data, type) => {
    try {
        if (data) {
            const colval = Object.keys(data).map(function(key) {
                return data[key];
            });
            const SelectQuery = SelectQuerytable(table,data, type);
            const { rows } = await db.query(`${SelectQuery}`, colval);
            return rows;
        } else {
            const { rows } = await db.query(`select * from ${table} ORDER BY id DESC`);
            return rows;
        }


    } catch (err) {
        throw err;
    }

}

const delete_ = async(table, data) => {
    try {
        const colval = Object.keys(data).map(function(key) {
            return data[key];
        });
        const deletQuery = DeletQuerytable(table, data);
        const { rows } = await db.query(`${deletQuery}`, colval);
        return rows;
    } catch (err) {
        throw err.detail;
    }

}

const update = async(table, where, data) => {

    try {
        console.log(table, where, data);
        const colval = Object.keys(data).map(function(key) {
            return data[key];
        });
        const UpdateQuery = UpdateQuerytable(table, where, data);
        await db.query(`${UpdateQuery}`, colval);
        return ;
    } catch (err) {
        throw err;
    }
}
const increment = async(table, id, data) => {

    try {

        await db.query(`UPDATE ${table} SET ${data} = ${data} + 1
     WHERE id = ${id};`);
     return ;
    } catch (err) {
        throw err;
    }
}
const decrement = async(table, id, data) => {

    try {
console.log(`UPDATE ${table} SET ${data} = ${data} - 1
WHERE id = ${id};`);
        await db.query(`UPDATE ${table} SET ${data} = ${data} - 1
     WHERE id = ${id};`);
     return ;
    } catch (err) {
        throw err;
    }
}



const genarateAuthToken = (id) => {
    const token = jwt.sign({ id: id.toString() }, process.env.TOKEN_KEY)
    return token;
}

const getuser = async() => {
    const { rows } = await db.query('SELECT * FROM users ')
    return rows
}

const findByCredentials = async(idIug , password) => {
    try {
        const user = await find('users', { idIug  });
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            console.log("why");
            throw "Unable to login ";
        }
   
        return user[0].id;
    } catch (err) {
        console.log(err);
        throw "Unable to login ";
    }
}
module.exports = {
    creat,
    find,
    delete_,
    update,
    getuser,
    genarateAuthToken,
    findByCredentials,
    increment,
    decrement
}