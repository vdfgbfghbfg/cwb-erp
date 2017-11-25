var express = require('express');
var expressSanitized = require("express-sanitized");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressSanitized());
mongoose.connect("mongodb://matheus:matheus@ds139994.mlab.com:39994/heroku_8gpr6wtd", {useMongoClient: true}, function(){
	console.log("and MongoDB is ok!")
});
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride("_method"));

app.get('/', (req,res) => {res.render('views/home/home')})

app.listen(proc.ENV.port || 3000, function(){
	console.log('Server online')
})