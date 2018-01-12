const _ = require('lodash');
const promise = require('bluebird');
const fn = require('../helpers/functions');
const queryHelper = require('../helpers/query');

const BaseModel = require('./model');


//EXTEND TokenModel from basemodel
function TokenModel(){
	this.tableName = 'token';

	this.getFields = function(){
		return [{ 
				name : "id" 
			},{ 
				name : "user_id"
			},{ 
				name : "code" 
			},{ 
				name : "created_at" 
			},{ 
				name : "type" 
		}];
	}

	this.getRules = function(){
		return [{ 
			user_id : {
				required : true
			}
		}];
	}

	this.createToken = function(obj, cb){
		if(this.load(obj)){
			//SET AUTH KEY
			this.set('code', fn.getRandStr());

			this.save(cb);
						
		}else{
			console.log(this.getErrors());
			cb(new Error('Unable to link token with user'));
		}
	} 
}	


TokenModel.prototype = new BaseModel();
TokenModel.prototype.constructor = TokenModel;

module.exports = TokenModel;