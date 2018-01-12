const _ = require('lodash');
const promise = require('bluebird');
const BaseModel = require('./model');
const UserModel 	= require('./user');
const TokenModel 	= require('./token');
const fn 			= require('../helpers/functions');
const queryHelper 	= require('../helpers/query');
const emailHelper 	= require('../helpers/email');
const userconfig 	= require('../config').app.user;


//EXTEND ConfimationModel from basemodel
function ConfimationModel(){
	
	this.tableName = '';

	this.getFields = function(){
		return [{ 
				name : "id"
			}, {
				name : "code"		 
		}];
	}

	this.getRules = function(){
		return [{ 
			id : {
				required : true
			},
			code : {
				required : true
			}
		}];
	}

	this.confirmUser = function(userid, cb){
		let model = new UserModel();
		
		console.log(UserModel);
		
		model.findOne(userid,  function(err, result){
			if(err) return cb(err);

			model.set('confirmed_at', fn.now());

			model.save(function(err, result){
				if(err) return cb(err);
				
				let token = new TokenModel();
					token.deleteAll({ user_id : model.get('id')}, function(){
					if(err) return cb(err);
					return cb(err, { message : 'user successfully confirmed'});
				});
			})
		});
	} 
}	


ConfimationModel.prototype = new BaseModel();
ConfimationModel.prototype.constructor = ConfimationModel;

module.exports = ConfimationModel;