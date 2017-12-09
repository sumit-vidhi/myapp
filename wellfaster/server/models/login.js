const _ = require('lodash');
const promise = require('bluebird');
const fn = require('../helpers/functions');
const queryHelper = require('../helpers/query');

const BaseModel = require('./model');
const UserModel = require('./user');


//EXTEND LoginModel from basemodel
function LoginModel(){
	this.tableName = 'user';

	this.getFields = function(){
		return [{ 
				name : "email" 
			},{ 
				name : "password" 
			},{ 
				name : "rememberme" 
		}];
	}

	this.getRules = function(){
		return [{ 
			email : {
				required : true,
				email : true
			},
			password : {
				required : true
			},
		}];
	}

	this.login = function(cb){
		this.filterTableData(function(err,  data){
			if(data){
				let user = new UserModel();
				user.create(data, cb);		
			}else{
				cb(new Error("Unable to filter table data"))
			}
			
		});
	}
}	



LoginModel.prototype = new BaseModel();
LoginModel.prototype.constructor = LoginModel;

module.exports = LoginModel;