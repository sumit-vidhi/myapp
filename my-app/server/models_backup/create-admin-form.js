const _ = require('lodash');
const promise = require('bluebird');
const fn = require('../helpers/functions');
const queryHelper = require('../helpers/query');

const BaseModel = require('./model');
const UserModel = require('./user');


//EXTEND CreateAdminForm from basemodel
function CreateAdminForm(){
	this.tableName = 'user';

	this.getFields = function(){
		return [{ 
				name : "username" 
			},{ 
				name : "first_name"
			},{ 
				name : "last_name" 
			},{ 
				name : "password" 
			},{ 
				name : "confirm_password"
			},{ 
				name : "role"	 	
		}];
	}

	this.getRules = function(){
		return [{ 
			username : {
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
			confirm_password : {
				required : true,
				equal  : "password" 
			},
			role : {
				required : true
			},
		}];
	}
}	



CreateAdminForm.prototype = new BaseModel();
CreateAdminForm.prototype.constructor = CreateAdminForm;

module.exports = CreateAdminForm;