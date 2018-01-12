const _ = require('lodash');
const Promise = require("bluebird");
const validator = require('../helpers/validator');
const queryHelper = require('../helpers/query'); 
const fn = require('../helpers/functions'); 




function BaseModel(){
	this.fields = [];
	this.errors = [];
}

BaseModel.prototype.table = function(){
	return this.tableName;
}	

BaseModel.prototype.get = function(field){
	let self = this, _temp = {}; 
	if(self.fields && self.fields.length > 0){
		_.each(self.fields, function(field, index){
			if( fn.isSet(field.name) && fn.isSet(field.value)){
				_temp[field.name] = field.value;
			}
		});

		if(field) return _temp[field];
	}
	return 	_temp;	
}

BaseModel.prototype.set = function(name, value){
	let self = this; 
	if( fn.isSet(name) && fn.isSet(value)){
		if(self.fields && self.fields.length > 0){
			let i = _.findIndex(self.fields, { name : name});
			if(i > 0)
				return self.fields[i]['value'] = value;
		}	
	}
	return false;
}

BaseModel.prototype.getTableFields = function(cb){
	let sql = 	queryHelper.format("SHOW COLUMNS FROM ??", this.table());
	let _fields = [];
	let query = queryHelper.execute(sql, function(err, rows){
		if(rows){
			_.each(rows, function(row){
				_fields.push(row.Field);
			})
 		}
		cb(err, _fields);
	});
}

BaseModel.prototype.load = function(data){
	try{
		this.fields = this.getFields();
		if(this.fields && data){
			_.each(this.fields, function(field, index, fields){
				for(i in data){
					if(field.name === i){
						fields[index].value = fn.trim(data[i]);
					}
				}	
			});
			return true;
		}
		return false;
	}catch(ex){
		console.log(ex);
		return null;
	}	
}

BaseModel.prototype.validate = function(){
	try{
		let errors = [];
		let rules = this.getRules();
		let isValid = false;

		if(this.fields && rules && rules.length > 0){
			_.each(this.fields, function(field, index, fields){
				let fieldName = field.name;
				let fieldRules = rules[0][fieldName];
				
				if(fieldRules){
					let error = validator.validate(field, fieldRules, fields);
					if(error){
						errors.push({
							name : field.name,
							message : error
						});
					}
				}
			});
			isValid = (errors.length > 0) ? false : true;
			this.errors = errors;
		}
		return isValid;
	}catch(ex){
		console.log(ex);
		return false;
	}	
}


BaseModel.prototype.findOne = function(id, cb){
	let self = this;
	if(! id) return cb(new Error('No id provided for find User'));
	
	let options = { 
		table : this.table(), 
		params : { id : id }
	};
	
	queryHelper.queryOne(options, function(err, rows){
		if(! id) return cb(err);

		if(rows.length > 0){
			self.load(rows[0]);
			return cb(err, rows[0]);
		}
		return cb(new Error('Invalid user id'));

	});
}

BaseModel.prototype.findAll = function(params, cb){
	this.find(params, cb);
}

BaseModel.prototype.find = function(params, cb){
	let self = this;
	let options = { 
		table : self.table(), 
		params : params
	};
	queryHelper.queryAll(options, cb);
}

BaseModel.prototype.delete = function(id, cb){
	let self = this;
	let options = { 
		table : self.table(), 
		params : { id : id }
	};
	queryHelper.deleteAll(options, cb);
}

BaseModel.prototype.deleteAll = function(params, cb){
	let self = this;
	let options = { 
		table : self.table(), 
		params : params
	};
	console.log(options);
	queryHelper.deleteAll(options, cb);
}

BaseModel.prototype.save = function(cb){
	let self = this;
	if(self.validate()){
		self.filterTableData(function(err, params){
			if(params){

				console.log('params===============');
				console.log(params);
				params = self.beforeSave(params);

				//IF ID EXIST UPDATE EXISTING USER ELSE CREATE NEW
				if(fn.isSet(params.id)){
					queryHelper.update(table = self.table(), data = params, where = { id : params.id}, cb);
				}else{
					queryHelper.insert(table = self.table(), data = params, function(err, result){
						if(err) return cb(err);

						self.findOne(result.insertId, function(err, data){
							if(err) return cb(err);

							self.load(data);
							
							cb(err, data);
						})
					});
				}

			}else{
				cb(new Error('Unable to save new user'));
			}
		})
	}
	
}


BaseModel.prototype.beforeSave = function(params){
	for(i in params){
		if(fn.isDate(params[i])){
			params[i] = fn.toDateTime(params[i]);
		}
	}	

	console.log(params);	
	return params;	
}

BaseModel.prototype.filterTableData = function(cb){
	let data = this.get();
	console.log(data);
	this.getTableFields(function(err, tableFields){
		if(data && tableFields && tableFields.length > 0){
			for(i in data)
				if(tableFields.indexOf(i) < 0)
					delete data[i];

			return cb(err, data);	
		}
		return cb(new Error("Error in filter table data"));
	});
}

BaseModel.prototype.getErrors = function(){
	return this.errors || [];
}

module.exports = BaseModel;