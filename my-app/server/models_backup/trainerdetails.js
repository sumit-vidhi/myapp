const _ = require('lodash');
const promise = require('bluebird');
const fn = require('../helpers/functions');
const queryHelper = require('../helpers/query');

const BaseModel = require('./model');


//EXTEND TokenModel from basemodel
function TrainerdetailsModel(){
	this.tableName = "users_details";

	this.getFields = function(){
		return [{ 
			name : "id" 
		      },{ 
				name : "trainer_id" 
			},{ 
				name : "first_name"
			},{ 
				name : "last_name" 
			},{ 
				name : "nickname" 
			},{ 
				name : "birth_date" 
			},{ 
				name : "phone_number" 
		    },{ 
				name : "perferred_languages" 
		    },{ 
				name : "additional_language" 
			},{ 
				name : "specialities" 
		   },{ 
			    name : "education" 
		   },{ 
			    name : "certifications" 
			},{ 
				name : "bio" 
		   },{ 
			name : "description" 
		},{ 
			name : "additional_description" 
		},{ 
			name : "weeklyprice" 
		},{ 
			name : "city" 
		},{ 
			name : "street" 
		},{ 
			name : "city" 
	   },{ 
			name : "country" 
		},{ 
			name : "zip" 
	   }
		];
	}

	this.getRules = function(){
		return [{
			user_id : {
			required : true
		},
		first_name : {
			required : true
		},
		last_name : {
			required : true
		}
	}];
	}

	this.createdetails = function(obj,data, cb){
//console.log(obj.user_id);
		if(this.load(data)){
		//	console.log(121212);
			this.set('user_id',obj.user_id);

			this.save(cb);
						
		}else{
			console.log(this.getErrors());
			cb(new Error('Unable to link token with user'));
		}
	} 
}	


TrainerdetailsModel.prototype = new BaseModel();
TrainerdetailsModel.prototype.constructor = TrainerdetailsModel;

module.exports = TrainerdetailsModel;