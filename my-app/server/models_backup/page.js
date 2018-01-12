const _ = require('lodash');
const promise = require('bluebird');
const fn = require('../helpers/functions');
const queryHelper = require('../helpers/query');

const BaseModel = require('./model');


//EXTEND PageModel from basemodel
function PageModel(){
	this.tableName = 'page';

	this.getFields = function(){
		return [{ 
				name : "id" 
			},{ 
				name : "title"
			},{ 
				name : "content" 
			},{ 
				name : "status" 
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


PageModel.prototype = new BaseModel();
PageModel.prototype.constructor = PageModel;

module.exports = PageModel;