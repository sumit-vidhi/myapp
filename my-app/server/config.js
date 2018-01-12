/*************************************************/
/*			  APP CONGIFURATION 	 	         */	
/*************************************************/
let app = {
	siteUrl     : "http://localhost:3001/",
	siteName    : "Wellfaster",
};

app.user =  {
	enableConfirmation 	: true,
	enableSession 		: true,
	enableAutoLogin 	: true,
	sessionDuration 	: 000,
	cookieDuration 		: 1209600, // 2  weeks,
	cookieMaxDuration   : 3600000,  
	defaultPassword 	: '123456',
	tokenSecret			: 'ilovewellfastertoomuch',
	sessionSecret 		: 'ilovewellfastertoomuch', 
	cookieSecret 		: 'ilovewellfastertoomuch', 

}, 
app.admin = {
	email : "admin@wellfaster.com"
}

exports.app = app;	

/*************************************************/
/*			MAILER CONGIFURATION 	 	         */	
/*************************************************/
	exports.email = {
		host: 'smtp.gmail.com', //Gmail SMTP server address
		port: 587, //Gmail SMTP port (TLS): 587, Gmail SMTP port (SSL): 465
		secure: false, // true for 465, false for other ports
	 	auth: {
			user: 'kuldeep@wegile.com', // Gmail SMTP username
			pass: '09111987'  // Gmail SMTP password
		}
	};		

/*************************************************/
/*			DATABASE CONGIFURATION 	 	         */	
/*************************************************/
	// exports.db = {
	// 	connectionLimit: 10,
	// 	host     : 'localhost',
	// 	user     : 'root',
	// 	password : 'root',
	// 	database : 'wellfaster'
	// };

// 	var sql = require('mssql');
	
	// Create connection to database
	exports.db = {
	  user: 'wegile@wellfaster', // update me
	  password: 'W3gile@dev$%', // update me
	  server: 'wellfaster.database.windows.net',
	  database: 'Wellfaster',
	  options: {
		  database: 'Wellfaster',
		  encrypt:true
	  },
	  port:1433
	}
// 	// connect to your database
// sql.connect(config, function (err) {
	
// 		if (err) console.log(err);
// 	console.log("connected");
// 		// create Request object
// 		var request = new sql.Request();
	
// 		// query to the database and get the records
// 		request.query('select * from users', function (err, recordset) {
	
// 			if (err) console.log(err)
	
// 			// send records as a response
// 			console.log(recordset);
	
// 		});
// 	});


/*************************************************/
/*					LOCAL PATHS 	 	         */	
/*************************************************/

	exports.paths = {
		model : './models',
		helper : './helpers'

	};
/*************************************************/
/*					LOCAL URLS  	 	         */	
/*************************************************/
	let urls = {};
	urls.confirmAccount  = app.siteUrl + "email_varification";
	urls.resetPassword	 = app.siteUrl + "reset_password";
	urls.acceptTrainer	 = app.siteUrl + "accept_trainer";
	urls.declineTrainer	 = app.siteUrl + "decline_trainer";
	
	exports.urls = urls;

/*************************************************/
/*					STORAGE     	 	         */	
/*************************************************/

	exports.paths = {
		base 	: __dirname + '/',
		helpers : __dirname + '/helpers/',
		ctrls 	: __dirname + '/controllers/',
		models 	: __dirname + '/models/',
		uploads : __dirname + '/uploads/'
	};

/*************************************************/
/*					STORAGE     	 	         */	
/*************************************************/

	exports.storage = {

	};
	
/*************************************************/
/*					PARAMS      	 	         */	
/*************************************************/

	exports.params = {

	}