const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const mqtt = require('mqtt')
const client  = mqtt.connect('mqtt://ismaillowkey.my.id:1883')

client.on('connect', function () {
  console.log('connected to mqtt')
  // setelah connect ke mqtt, subscribe topic
  client.subscribe('data/#')
})

// parse application/json
app.use(bodyParser.json());
 
// create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});
 
// connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//tampilkan semua data 
app.get('/api/haiwell',(req, res) => {
  let sql = "SELECT * FROM haiwell";
  conn.query(sql, (err, results) => {
    // jika error
    if(err) {
      res.status(400)
      res.json({
        status: 400,
        success: false,
        message: 'error when get data from database',
        error: err,
        data: null
      })
    }
    // jika tidak error
    else{
      res.json({
        status: 200,
        success: true,
        message: '',
        error: null,
        data: results
      })
    }
  });
});


//tampilkan data berdasarkan date
app.get('/api/haiwell',(req, res) => {
  let sql = `SELECT * FROM haiwell WHERE DATE(date) = '${req.query.date}'`;
  console.log(sql);
  conn.query(sql, (err, results) => {
    // jika error
    if(err) {
      res.status(400)
      res.json({
        status: 400,
        success: false,
        message: 'error when get data from database',
        error: err,
        data: null
      })
    }
    // jika tidak error
    else {
      res.json({
        status: 200, 
        success: true, 
        message: '',
        error: null, 
        data: results
      });
    }
  });
});
 
//tampilkan data berdasarkan date
app.get('/api/haiwell/range',(req, res) => {
  let sql = `SELECT * FROM haiwell WHERE DATE(date) BETWEEN '${req.query.startdate}' AND '${req.query.enddate}'`;
  console.log(sql);
  conn.query(sql, (err, results) => {
    // jika error
    if(err) {
      res.status(400)
      res.json({
        status: 400,
        success: false,
        message: 'error when get data from database',
        error: err,
        data: null
      })
    }
    // jika tidak error
    else {
      res.json({
        status: 200, 
        success: true, 
        message: '',
        error: null, 
        data: results
      });
    }
  });
});

/* tidak dipakai dulu
//Tambahkan data baru
app.post('/api/haiwell',(req, res) => {
  let data = { 
    date: req.body.date, 
    data1: req.body.data1,
    data2: req.body.data2,
    data3: req.body.data3
  };

  let sql = "INSERT INTO haiwell SET ?";
  conn.query(sql, data,(err, results) => {
    // jika error
    if(err) {
      res.status(400)
      res.json({
        status: 400,
        success: false,
        message: 'error when insert data from database',
        error: err,
        data: null
      })
    }
    else {
      res.json({
        status: 200, 
        success: true,
        message: '',
        error: null, 
        data: results
      });
    }
  });
});
*/ 

/* tidak dipakai dulu
//Edit data haiwell berdasarkan id
app.put('/api/haiwell/:id',(req, res) => {
  let sql = `UPDATE haiwell SET date= '${req.body.date}', 
      data1='${req.body.data1}',
      data2='${req.body.data2}'
      data3='${req.body.data3}' 
      WHERE id='${req.params.id}'`;
  
  conn.query(sql, (err, results) => {
    // jika error
    if(err) {
      res.status(400)
      res.json({
        status: 400,
        success: false,
        message: 'error when update data from database',
        error: err,
        data: null
      })
    }
    else {
      res.json({
        status: 200, 
        success: true,
        message: '',
        error: null, 
        data: results
      });
    }
  });
});
*/ 

/* tidak dipakai dulu
//Delete data product berdasarkan id
app.delete('/api/haiwell/:id',(req, res) => {
  let sql = `DELETE FROM haiwell WHERE id='${req.params.id}'`;
  conn.query(sql, (err, results) => {
    // jika error
    if(err) {
      res.status(400)
      res.json({
        status: 400,
        success: false,
        message: 'error when update data from database',
        error: err,
        data: null
      })
    }
    else {
      res.json({
        status: 200, 
        success: true,
        message: '',
        error: null, 
        data: results
      });
    }
  });
});
*/
 
client.on('message', function (topic, message) {
  // get topic
  console.log('topic received')
  console.log(topic)
  //console.log('payload')
  //console.log(message.toString())

  // jika topic ini diterima, maka save ke database
  if (topic === 'data/pcismail/building1/5528588624233216995') {
    console.log('save data')
    let objJSON = JSON.parse(message);
    
    // ikutin data JSON yang dikirim/publish oleh HMI via mqtt
    let data = { 
      date: objJSON._terminalTime, 
      data1: objJSON.data1,
      data2: objJSON.data2,
      data3: objJSON.data3
    };

    let sql = "INSERT INTO haiwell SET ?";
    conn.query(sql, data,(err, results) => {
      // jika error
      if(err) {
        console.log('error while insert data')
        console.log(err)
      }
      else {
        console.log('success insert data')
      }
    });
    
  }
})

//Server listening
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});