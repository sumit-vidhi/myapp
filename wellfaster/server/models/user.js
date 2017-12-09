const _ 			= require('lodash');
const promise 		= require('bluebird');
const BaseModel 	= require('./model');
const TokenModel 	= require('./token');
const fn 			= require('../helpers/functions');
const queryHelper 	= require('../helpers/query');
const emailHelper 	= require('../helpers/email');
const userconfig 	= require('../config').app.user;



//EXTEND RegisterModel from basemodel
function UserModel(){
	this.tableName = 'user';

	this.getFields = function(){
		return [{ 
				name : "id" 
			},{ 
				name : "email" 
			},{ 
				name : "first_name"
			},{ 
				name : "last_name" 
			},{ 
				name : "password" 
			},{
				name : "auth_key"
			},{
				name : "confirmed_at"
			}, {
				name : "user_type"
		}];
	}

	this.getRules = function(){
		return [{ 
			email : {
				required : true,
				email : true
			},
			first_name : {
				required : true
			},
			last_name : {
				required : true
			},
			password : {
				required : true
			},
			auth_key : {
				required : true
			},
		}];
	}

	this.findByEmail = function(email, cb){
		let query = queryHelper.queryOne({ 
			table : this.tableName, 
			params : {
				email : email
			}			
		}, cb);
	}

	this.findByAuthKey = function(authKey, cb){
		let query = queryHelper.queryOne({ 
			table : this.tableName, 
			params : {
				auth_key : authKey
			}			
		}, cb);
	}

	this.register = function(obj, cb){
		let self = this;

		if(self.load(obj)){
			
			let pass = this.get('password');
			
			//IF PASSWORD IS NOT SET SET DEFAULT PASSWORD;
			if(! pass){
				pass = userconfig.defaultPassword;
			}
			//SET PASSWORD HASH
			self.set('password', fn.getHashSync(pass));

			//SET AUTH KEY
			self.set('auth_key', fn.getRandStr());

			if(userconfig.enableConfirmation == false){
				self.set('confirmed_at', fn.now());
				self.save(function(err, result){
					if(err) return cb(new Error('Unable to create user'));
					
					return cb(err, {
						message : 'user successfully created'
					});

				});
			}else{
				self.save(function(err, newUser){
					//IF ERROR RETURN
					if(err) return cb(new Error('Unable to create user'));
					
					let token = new TokenModel();

					token.createToken({ user_id : self.get('id') }, function(err, token){
						if(err) return cb(err);

						newUser.code = token.code;

						emailHelper.sendAccountConfirmation(newUser, function(err, info){
							if(err) return cb(new Error('Unable to send confirmation'));

							return cb(err, {
								message : 'message successfully send'
							});

						});
					});					
				});
			}			
		}else{
			console.log(this.getErrors());
			cb(new Error('Unable to register new user'));
		}
	}
	
	this.create = function(obj, cb){
		let self = this;

		if(self.load(obj)){
			
			let pass = userconfig.defaultPassword;
			
			//SET PASSWORD HASH
			self.set('password', fn.getHashSync(pass));

			//SET AUTH KEY
			self.set('auth_key', fn.getRandStr());

			self.set('confirmed_at', fn.now());

			self.save(function(err, newUser){
				//IF ERROR RETURN
				if(err) return cb(new Error('Unable to create user'));
					
				emailHelper.sendWelcome(newUser, function(err, info){
					if(err) return cb(new Error('Unable to send confirmation'));
					return cb(err, newUser);
				});
									
			});
						
		}else{
			console.log(this.getErrors());
			cb(new Error('Unable to register new user'));
		}
	}

	this.resetPassword = function(userid, password, cb){
		let self = this;
		
		self.findOne(userid, function(err, rows){
			if(err) cb(err);
			else if(fn.isSet(password)){
			
				//SET PASSWORD HASH
				self.set('password', fn.getHashSync(password));

				self.save(function(err, result){
					if(err) cb(err);
					else cb(err, {
						message : 'password_reset_success'
					})
				});
			}
		});
	}
}	



UserModel.prototype = new BaseModel();
UserModel.prototype.constructor = UserModel;

module.exports = UserModel;