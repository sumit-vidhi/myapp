const BaseModel = require('./model');


//EXTEND AdminLoginModel from basemodel
function AdminLoginModel(){
	this.tableName = 'admin';

	this.getFields = function(){
		return [{ 
				name : "username" 
			},{ 
				name : "password" 
			},{ 
				name : "rememberme" 
		}];
	}

	this.getRules = function(){
		return [{ 
			username : {
				required : true,
				email : true
			},
			password : {
				required : true
			},
		}];
	}
}	



AdminLoginModel.prototype = new BaseModel();
AdminLoginModel.prototype.constructor = AdminLoginModel;

module.exports = AdminLoginModel;