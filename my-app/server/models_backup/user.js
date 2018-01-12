const _ 			= require('lodash');
const promise 		= require('bluebird');
const BaseModel 	= require('./model');
const TokenModel 	= require('./token');
const UserdetailsModel 	= require('./userdetails');
const TrainerdetailsModel 	= require('./trainerdetails');
const fn 			= require('../helpers/functions');
const queryHelper 	= require('../helpers/query');
const emailHelper 	= require('../helpers/email');
const userconfig 	= require('../config').app.user;



//EXTEND RegisterModel from basemodel
function UserModel(){
	this.tableName = "users";

	this.getFields = function(){
		return [{ 
				name : "id" 
			},{ 
				name : "email" 
			},{ 
				name : "password" 
			},{
				name : "auth_token"
			},{
				name : "confirmed_at"
			}, {
				name : "role"
		    }, {
				name : "facebook_id"
		    }, {
				name : "google_id"
		    }, {
				name : "status"
		    }, {
				name : "is_loggedin"
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
			auth_token : {
				required : true
			},
		}];
	}

	this.findByEmail = function(email, cb){
	//	console.log(email);
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
		//console.log(obj);
		if(self.load(obj)){
			let pass = this.get('password');
			
			//IF PASSWORD IS NOT SET SET DEFAULT PASSWORD;
			if(! pass){
				pass = userconfig.defaultPassword;
			}
			//SET PASSWORD HASH
			self.set('password', fn.getHashSync(pass));

			//SET AUTH KEY
			self.set('auth_token', fn.getRandStr());
		
			if(userconfig.enableConfirmation == false){
			
				self.set('confirmed_at', fn.now());
				self.save(function(err, result){
					console.log(obj);
					if(err) return cb(new Error('Unable to create user'));
					
					if(result.role==1){
                         userdetails = new UserdetailsModel();
					}
					if(result.role==0){
                         userdetails = new TrainerdetailsModel();
					}
					
					userdetails.createdetails({ user_id : self.get('id') },obj, function(err, user){
						//console.log(11);
						if(err) return cb(err);
						return cb(err, {
							message : 'message successfully send'
						});
                     
					});

				});
			}else{
			
				self.save(function(err, newUser){
				//console.log(newUser);
					//IF ERROR RETURN
					if(err) return cb(new Error('Unable to create user'));
				    if(newUser.role==1){
						console.log(232323);
                         userdetails = new UserdetailsModel();
					}
					if(newUser.role==2){
						console.log(444444);
                         userdetails = new TrainerdetailsModel();
					}
					
					userdetails.createdetails({ user_id : self.get('id') },obj, function(err, user){
						//console.log(11);
						if(err) return cb(err);

						newUser.first_name = user.first_name;
						newUser.last_name = user.last_name;

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
			//console.log(rows);
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