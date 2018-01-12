const _ = require('lodash');
const promise = require('bluebird');
const BaseModel = require('./model');
const UserModel 	= require('./user');
const TokenModel 	= require('./token');
const fn 			= require('../helpers/functions');
const queryHelper 	= require('../helpers/query');
const emailHelper 	= require('../helpers/email');
const userconfig 	= require('../config').app.user;


//EXTEND ResendModel from basemodel
function ResendModel(){
	
	this.tableName = '';

	this.getFields = function(){
		return [{ 
			name : "email" 
		}];
	}

	this.getRules = function(){
		return [{ 
			email : {
				required : true,
				email : true
			}
		}];
	}

	this.resend = function(user, cb){
		let token = new TokenModel();
		token.createToken({ user_id : user.id }, function(err, token){
			if(err) return cb(err);
			
			user.code = token.code;

			emailHelper.sendAccountConfirmation(user, function(err, info){
				if(err) return cb(new Error('Unable to send confirmation'));

				return cb(err, {
					message : 'message successfully send'
				});

			});
		});	
	} 
}	


ResendModel.prototype = new BaseModel();
ResendModel.prototype.constructor = ResendModel;

module.exports = ResendModel;