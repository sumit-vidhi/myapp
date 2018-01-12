const _ = require('lodash');
const promise = require('bluebird');
const fn = require('../helpers/functions');
const queryHelper = require('../helpers/query');

const BaseModel = require('./model');


//EXTEND TokenModel from basemodel
function MessageModel(){
	this.tableName = 'messages';

	this.getFields = function(){
		return [{ 
			name : "id" 
		      },{ 
				name : "recipient_id" 
			},{ 
				name : "sender_id"
			},{ 
				name : "subject" 
			},{ 
				name : "message" 
			},{ 
				name : "attachments" 
			}
		];
	}

	this.getRules = function(){
		return [{ 
			
		}];
	}

	this.createdetails = function(obj,data, cb){
		if(this.load(data)){
			console.log(obj.user_id);
			this.save(cb);
						
		}else{
			console.log(this.getErrors());
			cb(new Error('Unable to link token with user'));
		}
	} 
}	


UserdetailsModel.prototype = new BaseModel();
UserdetailsModel.prototype.constructor = UserdetailsModel;

module.exports = UserdetailsModel;