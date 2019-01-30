var express = require('express')
var app = express()
var path = require("path");

app.use(express.static(path.join(__dirname, '../')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+ '../index.html'));
});

app.get('/', function (req, res) {
    res.send('Hello World')
});


// app.get('/', function (req, res) {
//   res.send('Hello World')
// })
 


//app.listen(3000)