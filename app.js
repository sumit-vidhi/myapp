// Get dependencies
const express 		= require('express');
const path 			= require('path');
const http 			= require('http');
const bodyParser 	= require('body-parser');
const cookieParser 	= require('cookie-parser');
const session      	= require('express-session');
const flash    		= require('connect-flash');
const config 		= require('./server/config');
const mw 			= require('./server/middleware');
const socket = require('socket.io');
const socketEvents = require('./server/helpers/socket'); 
const moment        = require('moment');



// Get our API routes
const apiRoutes 	= require('./server/api-routes');
//const adminRoutes 	= require('./server/routes');

const app 			= express();
var server  = require('http').createServer(app);
var io      = socket.listen( server );
// const server = http.createServer(app);
// const io = socketio(server);
var users = {};
var userNumber = 1;

function getUsers () {
   var userNames = [];
  
   for(var name in users) {
     if(users[name]) {
	   userNames.push(name);
     }
   }
console.log(userNames);
   return userNames;
}

io.on('connection', function (socket) {
	
	//var users=[];
	if (socket.handshake.query.id) {
		var myNumber = userNumber++;
		var myName = socket.handshake.query.id;
		users[myName] = socket;
		io.emit('users', getUsers());
		 // console.log(userNames);      
		 }
		
		
		socket.on('new-user', function(name, callback){
			if(name.length > 0){
				if(users.indexOf(name) == -1){
					socket.id = name;
					//users.push(socket.id);
					updateUsers();
					callback(true);
				} else{
					callback(false);
				}
			}
		});
	
		socket.on('new-message', function(data){
			//io.emit('push message', {name: sender, msg: message});
			for(var i = 0; i < users.length; i++) {
				if(users[i].id === data.receiver) {
				   console.log('message sent to' + users[i].socketid);
				   io.to([users[i].socketid]).emit('push message', {  message: data.message, sender: data.sender, receiver: data.receiver});
				 break;
				}
			 }  
			
		});

		socket.on('message', function (data) {
			messagedata={}
			data.created_at=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
			messagedata=data;
			console.log(messagedata);
			console.log(users);
			for(var name in users) {
			if(messagedata.recipient_id == name) {
				console.log('message sent to' + name);
			users[name].emit('message',messagedata); 
			}
		}
		 });
	
		function updateUsers(){
			//console.log(users);
			io.emit('users', users);
		}
	
		socket.on('disconnect', function () {
			users[myName] = null;
			io.emit('users', getUsers());
		  });
		socket.on('typing', function (data) {
				  //console.log(data);
				  socket.broadcast.emit('typing', data);
		});
	})
//app.use(temp);
const userConfig    = config.app.user;

/***********************************************************
 * 		SET APP VARIABLES AND GLOBAL VARIABLE              *
 ***********************************************************/

	app.set('config', config);

/***********************************************************
 * 				APPLY APP MIDDLEWARE                        *
 ***********************************************************/

 	

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); 					// Parsers for POST data

 	app.use(mw.allowCsrf);
 	app.use(mw.logger);


		
/***********************************************************
 * 				APP STATIC PATH                            *
 ***********************************************************/

 	app.use(express.static(path.join(__dirname, 'dist')));				// Point static path to dist

	//app.use('/img',express.static(path.join(__dirname, 'server/public/img')));
	app.use('/img',express.static(path.join(__dirname, 'server/uploads/users')));



/***********************************************************
 * 				APP ROUTES MIDDLEWARE                      *
 ***********************************************************/

 	app.use(function(req, res, next){
 		//console.log(req.body);
 		next();
 	});

	//app.use('/admin', adminRoutes); 
	app.use('/api', apiRoutes);			// 	app api urls


/***********************************************************
 * 				APP ERROR HANDLER                      	   *
 ***********************************************************/
 	// Catch all other routes and return the index file
	app.get('*', (req, res) => {
	  	res.sendFile(path.join(__dirname, 'dist/index.html'));
		//res.send('api working');	
	});
	



/***********************************************************
 * 	Get port from environment and store in Express.        *
 ***********************************************************/	

	const port = process.env.PORT || '3001';
	app.set('port', port);

/**
 * Create HTTP server.
 */

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
