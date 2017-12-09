const _ = require('lodash');
const promise = require('bluebird');
const BaseModel = require('./model');
const UserModel 	= require('./user');
const TokenModel 	= require('./token');
const fn 			= require('../helpers/functions');
const queryHelper 	= require('../helpers/query');
const emailHelper 	= require('../helpers/email');
const userconfig 	= require('../config').app.user;


//EXTEND SocialAccountModel from basemodel
function SocialAccountModel(){
	
	this.tableName = 'social_account';

	this.getFields = function(){
		return [{ 
				name : "id",
			},{
				name : "user_id"
			},{
				name : "provider",
			},{
				name : "client_id",
			},{
				name : 'data'
		}];
	}

	this.getRules = function(){
		return [{ 
			user_id : {
				required : true
			},
			provider : {
				required : true
			},
			client_id : {
				required : true
			},
			data : {
				required : true
			}
		}];
	}

	this.findByClientId = function(id, cb){
		this.find({
			client_id : id
		}, cb);
	}

	this.getUser = function(id, cb){
		if(! id)
			id = this.get('user_id');
		
		let userModel = new UserModel();
		userModel.findOne(id, cb);
	}

	this.getData = function(id, cb){
		userModel.find({ id : id }, cb);
	}	
}	


SocialAccountModel.prototype = new BaseModel();
SocialAccountModel.prototype.constructor = SocialAccountModel;

module.exports = SocialAccountModel;