//require('http://ece.ubc.ca/~kumseok/src/cpen400a/jquery-3.3.1.min.js');
//require("http://ece.ubc.ca/~kumseok/src/cpen400a/test-5.js");
// Require dependencies
var storeDB = require('./StoreDB');
var db = new storeDB("mongodb://localhost", "cpen400a-bookstore");
var path = require('path');
var express = require('express');

// Declare application parameters
var PORT = process.env.PORT || 3000;
var STATIC_ROOT = path.resolve(__dirname, './public');
console.log("This is STATIC ROOT: ");
// Defining CORS middleware to enable CORS.
// (should really be using "express-cors",
// but this function is provided to show what is really going on when we say "we enable CORS")
function cors(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS,PUT");
	next();
}

// Instantiate an express.js application
var app = express();

// Configure the app to use a bunch of middlewares
app.use(express.json());							// handles JSON payload
app.use(express.urlencoded({ extended: true }));	// handles URL encoded payload
app.use(cors);										// Enable CORS

app.use('/', express.static(STATIC_ROOT));			// Serve STATIC_ROOT at URL "/" as a static resource

// Configure '/products' endpoint
//app.get('/products', function (request, response) {

	//if(response.status!=500) {
	// try {
	// 	var products = db.getProducts(request.query);
	// 	console.log(request.query);
	// 	console.log(products);
	// 	response.status(200).send(products);
	// } catch (error) {
	// 	response.status = 500;
	// 	response.send('There exists an Error during the database operation!');
	// }

	//console.log("products are: " + products);

	//} else {
	//console.log("== 500");
	//response.status = 500;
	//response.send('There exists an Error during the database operation!');
	//}	
	
//});

app.get('/products', async function (request, response) {
	var products = await db.getProducts(request.query);
	if (products instanceof Error) {
		
		response.status("500").send(products);
	}
	else {
		//console.log(products);
		response.status("200").send(products);
	}
	response.end();
});

app.post('/checkout', async function (request, response) {
	//var order = request.body;
	if (order.hasOwnProperty("client_id") && typeof order["client_id"] == String) {
		var addOrder = await db.addOrder(request.body);
		if (addOrder instanceof Error) {
			response.status("500").send(addOrder);
		} else {
			response.status("200").send(addOrder);
		}
	}
});

// Start listening on TCP port
app.listen(PORT, function () {
	console.log('Express.js server started, listening on PORT ' + PORT);
});