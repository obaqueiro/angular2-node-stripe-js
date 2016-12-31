var app = require('express')();
var bodyParser = require('body-parser');
var stripe = require('stripe')('sk_test_BQokikJOvBiI2HlWgH4olfQ2');
var mysql = require('mysql');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	 	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

connection = mysql.createConnection({
	host: 'localhost',
	user: '', // your username
	password: '', // your password
	database: '' // your database name
});

connection.connect(function(err) {
	if(err) throw err;

	console.log('Database connected...');
});

app.all('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.post('/user/donate', (req, res) => {
	// Receive charge detail and card token. First, create a customer object
	// with stripe so you can charge user later without requesting them again
	// for their payment detail. Save customer relevant data to db and send
	// success confirm and userId back to client.

	var cardToken = req.body.cardToken;
	var amount = req.body.amount;

	stripe.customers.create({
		source: cardToken,
		description: "user payment" // this is usually the user email
	}).then(function(customer) {
		connection.query("INSERT INTO stripe (amount, stripeCustomerId) VALUES (?, ?)", [amount, customer.id], function(err, info) {
			if(err) throw err;

			console.log("Success result sent back");

			res.send({
				success: true,
				userId: info.insertId
			});
		});
	});
});

app.post('/admin/donate/accept', (req, res) => {
	// Receive userId via POST request, then query DB for the user object.
	// Create charge based on info returned and update chargeStatus in the db
	// Send success confirmation back to client.


	var userId = req.body.userId;

	connection.query("SELECT * FROM stripe WHERE userId = ?", [userId], function(err, rows, info) {
		if(err) throw err;

		var user = rows[0];
		var charge = stripe.charges.create({
			amount: user.amount * 100,
			currency: 'aud',
			customer: user.stripeCustomerId,
			description: "Single donation charge"
		}, function(err, charge) {
			if(err) {
				switch (err.type) {
				  case 'StripeCardError':
				    // A declined card error
				    res.send({
				    	success: false,
				    	errorMessage: err.message
				    });
				    
				    break;
				  case 'RateLimitError':
				    // Too many requests made to the API too quickly
				    res.send({
				    	success: false,
				    	errorMessage: err.message
				    });

				    break;
				  case 'StripeInvalidRequestError':
				    // Invalid parameters were supplied to Stripe's API
				    res.send({
				    	success: false,
				    	errorMessage: err.message
				    });
				    
				    break;
				  case 'StripeAPIError':
				    // An error occurred internally with Stripe's API
				    res.send({
				    	success: false,
				    	errorMessage: err.message
				    });
				    
				    break;
				  case 'StripeConnectionError':
				    // Some kind of error occurred during the HTTPS communication
				    res.send({
				    	success: false,
				    	errorMessage: err.message
				    });
				    
				    break;
				  case 'StripeAuthenticationError':
				    // You probably used an incorrect API key
				    res.send({
				    	success: false,
				    	errorMessage: err.message
				    });
				    
				    break;
				  default:
				    // Handle any other types of unexpected errors
				    res.send({
				    	success: false,
				    	errorMessage: 'System error'
				    });

				    break;
				}
			}

			connection.query("UPDATE stripe SET chargeStatus = 1 WHERE userId = ?", [userId], function(err, updateInfo) {
				if(err) throw err;

				res.send({
					success: true,
					resText: "The user is successfully charged"
				});
			});
		});
	});


})

var port = 5000 || process.env.PORT;

app.listen(port, () => {
	console.log("Listening to port " + port);
});
