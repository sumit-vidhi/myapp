const _ = require('lodash');
const promise = require('bluebird');
const fn = require('../helpers/functions');
const queryHelper = require('../helpers/query');

const BaseModel = require('./model');
const UserModel = require('./user');


//EXTEND ChanngeAdminPasswordForm from basemodel
function ChanngeAdminPasswordForm(){
	this.tableName = 'user';

	this.getFields = function(){
		return [{ 
				name : "old_password" 
			},{ 
				name : "new_password"
			},{ 
				name : "password_again" 
		}];
	}

	this.getRules = function(){
		return [{ 
			old_password : {
				required : true,
			},
			new_password : {
				required : true
			},
			password_again : {
				required : true,
				equal  : "new_password"
			}
		}];
	}
}	



ChanngeAdminPasswordForm.prototype = new BaseModel();
ChanngeAdminPasswordForm.prototype.constructor = ChanngeAdminPasswordForm;

module.exports = ChanngeAdminPasswordForm;