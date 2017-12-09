const _ = require('lodash');
const promise = require('bluebird');
const fn = require('../helpers/functions');
const queryHelper = require('../helpers/query');

const BaseModel = require('./model');


//EXTEND bannerModel from basemodel
function bannerModel(){
	this.tableName = 'banner';

	this.getFields = function(){
		return [{ 
				name : "id" 
			},{ 
				name : "title"
			},{ 
				name : "content" 
			},{ 
				name : "photo" 
		}];
	}

	this.getRules = function(){
		return [{ 
			title : {
				required : true
			},
			content : {
				required : true
			},
			status : {
				required : true
			}
		}];
	}
}	


bannerModel.prototype = new BaseModel();
bannerModel.prototype.constructor = bannerModel;

module.exports = bannerModel;