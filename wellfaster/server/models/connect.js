const _ = require('lodash');
const promise 				= require('bluebird');
const BaseModel 			= require('./model');
const UserModel 			= require('./user');
const TokenModel 			= require('./token');
const SocialAccountModel 	= require('./social-account');
const fn 					= require('../helpers/functions');
const queryHelper 			= require('../helpers/query');
const emailHelper 			= require('../helpers/email');
const userconfig 			= require('../config').app.user;


//EXTEND ConnectModel from basemodel
function ConnectModel(){
	let self = this;
	
	this.tableName = '';

	this.getFields = function(){
		return [{ 
				name : "id",
			},{
				name : "email"
			},{
				name : "name",
			},{
				name : "provider",
			},{
				name : "photoUrl",	
		}];
	}

	this.getRules = function(){
		return [{ 
			id : {
				required : true
			},
			email : {
				required : true,
				email 	 : true
			},
			name : {
				required : true
			},
			provider : {
				required : true
			}
		}];
	} 

	self.linkWithUser = function(newUser, cb){
		let socialModel = new SocialAccountModel();
		let socialObj = {
			user_id : newUser.id,
			client_id : self.get('id'),
			provider : self.get('provider'),
			data : JSON.stringify(self.get())
		}

		socialModel.load(socialObj);

		socialModel.save(function(err,  result){
			if(err) return cb(err);
			return cb(err, newUser);
		});
	}

	self.findUserByEmail = function(cb){
		let userModel = new UserModel();
		userModel.find({ email : self.get('email')}, cb)
	}


	self.connect = function(cb){
		this.findUserByEmail(function(err, rows){
			if(err) return cb(err);

			else if(rows.length > 0){
				self.linkWithUser(rows[0], cb);
			}else{
				let userData = { 
					email: fn.trim(self.get('email')),
					first_name : fn.trim(self.get('name')).split(' ').slice(0, -1).join(' '),
					last_name  : fn.trim(self.get('name')).split(' ').slice(-1).join(' ')
				};
				let userModel = new UserModel();
				
				userModel.create(userData, function(err, newUser){
					if(err) return cb(err);
					self.linkWithUser(newUser, cb);
				});
			}
		})
	}
}	


ConnectModel.prototype = new BaseModel();
ConnectModel.prototype.constructor = ConnectModel;

module.exports = ConnectModel;