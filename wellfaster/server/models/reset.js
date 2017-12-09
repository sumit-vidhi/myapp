const _ = require('lodash');
const promise = require('bluebird');
const BaseModel = require('./model');
const UserModel 	= require('./user');
const TokenModel 	= require('./token');
const fn 			= require('../helpers/functions');
const queryHelper 	= require('../helpers/query');
const emailHelper 	= require('../helpers/email');
const userconfig 	= require('../config').app.user;


//EXTEND ResetModel from basemodel
function ResetModel(){
	
	this.tableName = '';

	this.getFields = function(){
		return [{ 
			name : "id" 
		},{ 
			name : "password" 
		},{ 
			name : "confirm_password" 
		}];
	}

	this.getRules = function(){
		return [{ 
			id : {
				required : true
			},
			password : {
				required : true,
			},
			confirm_password : {
				required : true,
				equal  : "password" 
			}
		}];
	}

	this.reset = function(cb){
		let self = this;
		let userModel = new UserModel();
		userModel.resetPassword(self.get('id'), self.get('password'), function(err, result){
			
			if(err) return cb(err);

			let token = new TokenModel();
				token.deleteAll({ user_id : self.get('id')}, function(){
				if(err) return cb(err);
				return cb(err, { message : result.message});
			});
		});	
	} 
}	


ResetModel.prototype = new BaseModel();
ResetModel.prototype.constructor = ResetModel;

module.exports = ResetModel;