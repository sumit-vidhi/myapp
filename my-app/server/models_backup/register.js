const _ = require('lodash');
const promise = require('bluebird');
const fn = require('../helpers/functions');
const queryHelper = require('../helpers/query');

const BaseModel = require('./model');
const UserModel = require('./user');


//EXTEND RegisterModel from basemodel
function RegisterModel(){
	this.tableName = 'users';

	this.getFields = function(){
		return [{ 
				name : "email" 
			},{ 
				name : "first_name"
			},{ 
				name : "last_name" 
			},{ 
				name : "password" 
			}
			,{ 
				name : "confirm_password" 
			},{ 
				name : "role" 
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
			confirm_password : {
				required : true,
				equal  : "password" 
			},
			agree : {
				required : true
			}
		}];
	}

	this.register = function(cb){
		//this.filterTableData(function(err,  data){
			//if(data){
				let data=this.get();
				let user = new UserModel();
				//console.log(data);
				user.register(data, cb);		
			//}else{
			//	cb(new Error("Unable to filter table data"))
		//	}
			
	//	});
	}
}	



RegisterModel.prototype = new BaseModel();
RegisterModel.prototype.constructor = RegisterModel;

module.exports = RegisterModel;