var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var app = express();

// use pool to prevent from endding connection manually
var pool = mysql.createPool({
    // connectionLimit: 10,
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'membership'
});

pool.getConnection(function(err) {
    if (err) {
        throw err;
    }
    console.log('connecting success');
});

// get the body data from req(json)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create a router to handle routes for a set of RestAPI
var restAPI = express.Router();

// read all accounts uri='/'
restAPI.get('/', function(req, res) {
    //res.json({ message: "hello world" });
    pool.query('SELECT * FROM members', function(err, result, field){
        if(err) {
            throw err;
        }
        res.json(result);
    });
});

// read an account uri='/:account'
restAPI.get('/:account', function(req, res) {
    pool.query('SELECT * FROM members WHERE account = ?',[req.params.account],
    function(err, result, field) {
        if(err) {
            throw err;
        }
        res.json(result);
    });
});

// create uri='/'
restAPI.post('/', function(req, res) {
    //res.json({ name: req.body.name, message: "success"});
    pool.query('INSERT INTO members VALUES (?, ?, ?, ?, ?, ?)',
        [req.body.account, req.body.phone, req.body.birthday, req.body.address,
            req.body.data_added_time, req.body.last_modified_time],
        function(err, result, field) {
            if(err) {
                throw err;
            }
            console.log(result.affectedRows + " record updated");
            res.json({result: 'success'});
        });

});

// update uri='/:account'
restAPI.put('/:account', function(req, res) {
    //res.json({ id:req.params.id, message: "update " + req.params.id });
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
    pool.query(str, list, function(err, result, field) {
        if(err) {
            throw err;
        }
        console.log(result.affectedRows + " record updated");
        res.json({result: 'success'});
    })
});

// delete uri='/:account'
restAPI.delete('/:account', function(req, res) {
    //res.json({ id: req.params.id, message: "byebye " + req.params.id });
    pool.query('DELETE FROM members WHERE account = ?', [req.params.account],
    function(err, result, field) {
        if(err) {
            throw err;
        }
        console.log(result.affectedRows + " record updated");
        res.json({result: 'success'});
    });
})

// attach the route for restAPI
app.use('/', restAPI);
app.list
