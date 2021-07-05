var express = require('express');
var app = express();
app.use(express.static(__dirname));
app.listen('7545 ');
console.log('Running at\nhttp://localhost:7545 ');