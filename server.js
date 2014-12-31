var http = require("http")
var fs = require("fs")
var path = require("path")
var sys = require("sys");
var express = require("express");

var host = process.env.HOST || 'localhost';
var port = process.env.PORT || 3000;
var debug = !process.env.HOST;

var app = express();
app.use(express.static(__dirname));
app.listen(port);

//exports.App = server