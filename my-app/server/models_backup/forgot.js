const _ = require('lodash');
const promise = require('bluebird');
const BaseModel = require('./model');
const UserModel 	= require('./user');
const TokenModel 	= require('./token');
const fn 			= require('../helpers/functions');
const queryHelper 	= require('../helpers/query');
const emailHelper 	= require('../helpers/email');
const userconfig 	= require('../config').app.user;


//EXTEND ForgotModel from basemodel
function ForgotModel(){
	
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

	this.request = function(user, cb){
		let token = new TokenModel();
		token.createToken({ user_id : user.id }, function(err, token){
			if(err) return cb(err);
			
			user.code = token.code;

			emailHelper.sendRequestPassword(user, function(err, info){
				if(err) return cb(new Error('Unable to send request'));

				return cb(err, {
					message : 'message successfully send'
				});

			});
		});	
	} 
}	


ForgotModel.prototype = new BaseModel();
ForgotModel.prototype.constructor = ForgotModel;

module.exports = ForgotModel;