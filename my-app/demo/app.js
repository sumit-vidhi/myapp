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

const app 			= express();

const userConfig    = config.app.user;

/***********************************************************
 * 		SET APP VARIABLES AND GLOBAL VARIABLE              *
 ***********************************************************/

	app.set('config', config);

/***********************************************************
 * 				APPLY APP MIDDLEWARE                        *
 ***********************************************************/

 	

 	app.use(bodyParser.json());												// Parsers for POST data

 	app.use(bodyParser.urlencoded({ extended: true }));    					// Parsers for POST data

 	app.use(mw.allowCsrf);
 	app.use(mw.logger);


		
/***********************************************************
 * 				APP STATIC PATH                            *
 ***********************************************************/

 	app.use(express.static(path.join(__dirname, 'dist')));				// Point static path to dist

	app.use('/img',express.static(path.join(__dirname, 'server/public/img')));




/***********************************************************
 * 				APP ROUTES MIDDLEWARE                      *
 ***********************************************************/

 	app.use(function(req, res, next){
 		console.log(req.body);
 		next();
 	});

	app.use('/api', apiRoutes);			// 	app api urls


/***********************************************************
 * 				APP ERROR HANDLER                      	   *
 ***********************************************************/
 	// Catch all other routes and return the index file
	app.get('*', (req, res) => {
	  res.sendFile(path.join(__dirname, 'dist/index.html'));
	});
	



/***********************************************************
 * 	Get port from environment and store in Express.        *
 ***********************************************************/	

	const port = process.env.PORT || '3001';
	app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));