const _ = require('lodash');
const promise = require('bluebird');
const fn = require('../helpers/functions');
const queryHelper = require('../helpers/query');

const BaseModel = require('./model');
const UserModel = require('./user');


//EXTEND EditAdminForm from basemodel
function EditAdminForm(){
	this.tableName = 'user';

	this.getFields = function(){
		return [{ 
				name : "id" 
			},{ 
				name : "username" 
			},{ 
				name : "first_name"
			},{ 
				name : "last_name",
			},{ 
				name : "role"	 
		}];
	}

	this.getRules = function(){
		return [{ 
			id : {
				required : true,
			},
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
			role : {
				required : true
			},
		}];
	}

	this.register = function(cb){
		this.filterTableData(function(err,  data){
			if(data){
				let user = new UserModel();
				user.register(data, cb);		
			}else{
				cb(new Error("Unable to filter table data"))
			}
			
		});
	}
}	



EditAdminForm.prototype = new BaseModel();
EditAdminForm.prototype.constructor = EditAdminForm;

module.exports = EditAdminForm;