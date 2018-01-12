const _ = require('lodash');
const promise = require('bluebird');
const fn = require('../helpers/functions');
const queryHelper = require('../helpers/query');

const BaseModel = require('./model');


//EXTEND TokenModel from basemodel
function UserdetailsModel(){
	this.tableName = "users_details";

	this.getFields = function(){
		return [{ 
			name : "id" 
		      },{ 
				name : "user_id" 
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
				name : "second_language" 
			},{ 
				name : "height" 
		   },{ 
			    name : "weight" 
		   },{ 
			    name : "units" 
			},{ 
				name : "start_week" 
		   },{ 
			name : "time_format" 
		},{ 
			name : "sleep_sensitivity" 
		},{ 
			name : "syride_length" 
		},{ 
			name : "heart_rate" 
		},{ 
			name : "timezone" 
		},{ 
			name : "description" 
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
        //console.log(data);
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


UserdetailsModel.prototype = new BaseModel();
UserdetailsModel.prototype.constructor = UserdetailsModel;

module.exports = UserdetailsModel;