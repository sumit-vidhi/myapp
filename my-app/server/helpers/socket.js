/*
* Real time private chatting app using Angular 2, Nodejs, mongodb and Socket.io
* @author Shashank Tiwari
*/


'use strict';

const path = require('path');
//const helper = require('./helper');

class Socket{

	constructor(socket){
		console.log(343434);
		this.io = socket;
		this.socketConfig();
	}
	
	socketEvents(){

		this.io.on('connection', (socket) => {

			// /**
			// * get the user's Chat list
			// */
			// socket.on('chat-list', (data) => {

			// 	let chatListResponse = {};

			// 	if (data.userId == '') {

			// 		chatListResponse.error = true;
			// 		chatListResponse.message = `User does not exits.`;
					
			// 		this.io.emit('chat-list-response',chatListResponse);

			// 	}else{

			// 		helper.getUserInfo( data.userId,(err, UserInfoResponse)=>{
						
			// 			delete UserInfoResponse.password;

			// 			helper.getChatList( socket.id,(err, response)=>{
						
			// 				this.io.to(socket.id).emit('chat-list-response',{
			// 					error : false ,
			// 					singleUser : false ,
			// 					chatList : response
			// 				});

			// 				socket.broadcast.emit('chat-list-response',{
			// 					error : false ,
			// 					singleUser : true ,
			// 					chatList : UserInfoResponse
			// 				});

			// 			});
			// 		});
			// 	}
		    // });

			/**
			* send the messages to the user
			*/
			socket.on('add-message', (data) => {

				if (data.message === '') {
					
					this.io.to(socket.id).emit(`add-message-response`,`Message cant be empty`); 

				}else if(data.fromUserId === ''){
					
					this.io.to(socket.id).emit(`add-message-response`,`Unexpected error, Login again.`); 

				}else if(data.toUserId === ''){
					
					this.io.to(socket.id).emit(`add-message-response`,`Select a user to chat.`); 

				}else{
					
					let toSocketId = data.toSocketId;
					let fromSocketId = data.fromSocketId;
					delete data.toSocketId;
		        	data.timestamp = Math.floor(new Date() / 1000);

					// helper.insertMessages(data,( error , response)=>{
						console.log(data);
					 	this.io.to(toSocketId).emit('add-message-response',data); 
					// });
				}				
		    });


			/**
			* Logout the user
			*/
			socket.on('logout',(data)=>{

				const userId = data.userId;
				
				// helper.logout(userId , false, (error, result)=>{

				// 	this.io.to(socket.id).emit('logout-response',{
				// 		error : false
				// 	});

				// 	socket.broadcast.emit('chat-list-response',{
				// 		error : false ,
				// 		userDisconnected : true ,
				// 		socketId : socket.id
				// 	});
				// });	
		    });


			/**
			* sending the disconnected user to all socket users. 
			*/
			socket.on('disconnect',()=>{
				socket.broadcast.emit('chat-list-response',{
					error : false ,
					userDisconnected : true ,
					socketId : socket.id
				});
		    });

		});

	}
	
	socketConfig(){
		console.log(1212)

		this.io.use(function(socket, next) {
			let userID = socket.request._query['userId'];
          	let userSocketId = socket.id;
          	const data = {
          		id : userID,
          		value : {
          			$set :{
          				socketId : userSocketId,
          				online : 'Y'
          			}
          		}
          	}
			  console.log(data)
          	// helper.addSocketId( data ,(error,response)=>{
          	// 	// socket id updated.
          	// });
          	next();
        });

        this.socketEvents();
	}
}
module.exports = Socket;