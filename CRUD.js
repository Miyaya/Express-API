var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var util = require('util');

var app = express();

// use pool to prevent from endding connection manually
var pool = mysql.createPool({
    // connectionLimit: 10,
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'membership'
});

pool.getConnection((err, connection) => {
    if (err) {
        throw err;
    }
    if (connection) connection.release();
    console.log('connecting success');
    return;
});

// get the body data from req(json)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// create a router to handle routes for a set of RestAPI
var restAPI = express.Router();

// promisify
pool.query = util.promisify(pool.query);

// read all accounts uri='/'
restAPI.get('/', (req, res) => { // function(req, res) {
    pool.query('SELECT * FROM members')
    .then (result => {
        res.json(result);
    }).catch ((err) => {
        throw err;
    });
});

// read an account uri='/:account'
restAPI.get('/:account', (req, res) => {
    pool.query('SELECT * FROM members WHERE account = ?',[req.params.account])
    .then (result => { // have to promisify pool.query first
        res.json(result);
    }).catch ((err) => {
        throw err;
    });
});

// create uri='/'
restAPI.post('/', (req, res) => {
    pool.query('INSERT INTO members VALUES (?, ?, ?, ?, ?, ?)',
        [req.body.account, req.body.phone, req.body.birthday, req.body.address, 
            req.body.data_added_time, req.body.last_modified_time])
        .then (result => {
            console.log(result.affectedRows + " record(s) updated");
            res.json({result: 'success'});
        }).catch ((err) => {
            res.json({result: 'failed' });
            throw err;
        });

});

// update uri='/:account'
restAPI.put('/:account', (req, res) => {
    var str = 'UPDATE members SET ';
    var list = [];
    var flag = false;

    if(req.body.phone !== 'undefined' && req.body.phone) {
        flag = true;
        str += 'phone = ? ';
        list.push(req.body.phone);
    }

    if(req.body.birthday !== 'undefined' && req.body.birthday) {
        if(flag) str += ', '; 
        flag = true;
        str += 'birthday = ? ';
        list.push(req.body.birthday);
    }

    if(req.body.address !== 'undefined' && req.body.address) {
        if(flag) str += ', '; 
        flag = true;
        str += 'address = ? ';
        list.push(req.body.address);
    }

    if(flag) str += ', '; 
    str += 'last_modified_time = ? WHERE account = ?';
    list.push(req.body.last_modified_time);
    list.push(req.params.account);

    pool.query(str, list)
    .then (result => {
        console.log(result.affectedRows + " record(s) updated");
        res.json({result: 'success' });
    }).catch ((err) => {
        res.json({result: 'failed' });
    });
});

// delete uri='/:account'
restAPI.delete('/:account', (req, res) => {
    pool.query('DELETE FROM members WHERE account = ?', [req.params.account])
    .then (result => {
        console.log(result.affectedRows + " record(s) updated");
        res.json({result: 'success'});
    }).catch (err => {
        res.json({result: 'failed' });
        throw err;
    });
})

// attach the route for restAPI
app.use('/', restAPI);
app.listen(3000, function() {
    console.log('listening on 3000...');
})
