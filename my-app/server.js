// Get dependencies
const express 		= require('express');
const path 			= require('path');
const http 			= require('http');
const bodyParser 	= require('body-parser');
const cookieParser 	= require('cookie-parser');
const session      	= require('express-session');
const flash    		= require('connect-flash');
const config 		= require('./server/config');
const mw			= require('./server/middleware');
const fn			= require('./server/helpers/functions');



// Get our API routes
const apiRoutes 	= require('./server/api-routes');

const routes 		= require('./server/routes');

const app 			= express();

const userConfig    = config.app.user;

/***********************************************************
 * 		SET APP VARIABLES AND GLOBAL VARIABLE              *
 ***********************************************************/
	
	app.set('views', path.join(__dirname, 'server/views'));

	app.set('view engine', 'ejs'); 											// set up ejs for templating

	app.set('config', config);

	global.SITE_NAME = config.app.siteName; 

	global.SITE_URL = config.app.siteUrl;

/***********************************************************
 * 				APPLY APP MIDDLEWARE                        *
 ***********************************************************/


 	// app.use(mw.allowCsrf);

 	// app.use(mw.logger);

 	app.use(bodyParser.json());												// Parsers for POST data

 	app.use(bodyParser.urlencoded({ extended: true }));    					// Parsers for POST data

 	app.use(session({ 
 			secret: userConfig.cookieSecret, 
 			cookie: { 
 				maxAge : userConfig.cookieMaxDuration 
 			}, 
 			resave: true, 
 			saveUninitialized: true 
 	}));

	app.use(flash()); 														// use connect-flash for session messages

	app.use(function(req, res, next){
	  res.locals.config = config;
	  res.locals.fn 	= fn;
	  next();
	});

		
/***********************************************************
 * 				APP STATIC PATH                            *
 ***********************************************************/

 	//app.use(express.static(path.join(__dirname, 'dist')));				// Point static path to dist

 	app.use('/img',express.static(path.join(__dirname, 'server/public/img')));
	
	app.use('/js',express.static(path.join(__dirname, 'server/public/js')));
	
	app.use('/css',express.static(path.join(__dirname, 'server/public/css')));
	
	app.use('/fonts',express.static(path.join(__dirname, 'server/public/fonts')));

	app.use('/vendor',express.static(path.join(__dirname, 'server/public/vendor')));

	app.use('/storage',express.static(path.join(__dirname, 'server/uploads')));
	
	app.use('/font-awesome',express.static(path.join(__dirname, 'server/public/font-awesome')));

	app.use('/bower_components',express.static(path.join(__dirname, 'bower_components')));

	app.use('/node_modules',express.static(path.join(__dirname, 'node_modules')));




/***********************************************************
 * 				APP ROUTES MIDDLEWARE                      *
 ***********************************************************/

	app.use('/admin', routes); 			//	app site urls


/***********************************************************
 * 				APP ERROR HANDLER                      	   *
 ***********************************************************/
 	/*app.get('/', (req, res) => {
	 'photo' res.send({"Message" : config.app.siteName});
	});
	*/

	//Catch all other routes and return the index file
	app.get('*', (req, res) => {
	   res.send({"Message" : config.app.siteName});
	});



/***********************************************************
 * 	Get port from environment and store in Express.        *
 ***********************************************************/	

	const port = process.env.PORT || '3000';
	app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));