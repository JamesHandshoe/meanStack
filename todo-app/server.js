//set up modules

var express = require('express'); 
var app = express();  //create the app with express
var mongoose = require('mongoose'); //mongoose for mongodb
var morgan = require('morgan'); //log requests to the console (express4)
var bodyParser = require('body-parser'); //pull information from HTML POST (express4)
var methodOverride = require('method-override'); //simulate DELETE and PUT (express4)

//configurations

//connect to mongoDB on modulus.io
mongoose.connect('mongodb://test:test@ds031895.mlab.com:31895/todoaholic');
// set the static files location
app.use(express.static(__dirname + '/public'));
//log every request to the console
app.use(morgan('dev'));
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended': 'true'}));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));
app.use(methodOverride());

//define mongo model
var Todo = mongoose.model('Todo', {
	text: String
});

// routes 
	//api
	

//get all todos
app.get('/api/todos', function(req, res){
	//use mongoose to get all todos in the database
	Todo.find(function(err, todos){
		//if error send it
		if (err) {
			res.send(err);
		}
		res.json(todos); //return all todos in JSON format
	});
});

app.post('/api/todos', function(req, res){
	//create a todo this information comes from AJAX within Angular
	Todo.create({
		text: req.body.text,
		done: false
	}, function(err, todo){
		if (err) {
			res.send(err);
		}

		//get and return all the todos after you create another
		Todo.find(function(err, todos){
			if (err) {
				res.send(err);
			}
			res.json(todos);
		});
	});
});

app.delete('/api/todos/:todo_id', function(req, res){
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo){
		if (err) {
			res.send(err);
		}
		res.json(todo);
	});
});

//this loads the index angular will handle the rest
app.get('/', function(req, res) {
	res.sendfile('./public/index.html');
});

//listen (start app w/ nodemon @ 8080)

app.listen(8080);
console.log("app listening on port 8080");