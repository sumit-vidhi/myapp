const validator = require('validator');
const _ = require('lodash');
const fn = require('./functions');

exports.validate = function(field, rules, fields){
	try{
		let name = field.name+'';
		let value = field.value+'';
		let errors = [];
		
		for (rule in rules){
			switch(rule){
				case "required" : 
					if(value == "false" || value == "undefined" || value == "null" || validator.isEmpty(value)){
						errors.push(fn.toCapitalize(name) + " is required.");
					}	
					break;
				case "email" : 
					if(! validator.isEmail(value)){
						errors.push(fn.toCapitalize(name) + " should be valid email address.");
					}
					break;
				case "min" : 
					if(validator.isLength(value, { min : rules[rule] })){
						errors.push(fn.toCapitalize(name) + " should be minimum "+rules[rule] +" character.");
					}
					break;
				case "max" : 
					if(validator.isLength(value)){
						errors.push(fn.toCapitalize(name) + " should be maximum "+rules[rule] +" character.");
					}
					break;
				case "number" : 
					if(validator.isNumeric(value)){
						errors.push(fn.toCapitalize(name) + " should be valid number.");
					}
					break;
				case "match" : 
					if(validator.matches(value, rules[rule])){
						
					}
					break;
				case "url" : 
					if(validator.isUrl(value)){
						errors.push(fn.toCapitalize(name) + " should be valid url.");
					}
					break;
				case "equal" : 
					let tempfield = _.find(fields, function(_field){
						return _field.name == rules[rule];
					});

					let compareTo = (tempfield) ? tempfield.value : null;
					
					if(! validator.equals(value, compareTo)){
						errors.push(fn.toCapitalize(name) + " should be same.");	
					}
									
					break;	
				case "int" : 
					if(validator.isInt(value, { min: 0, max : 100})){
						errors.push(fn.toCapitalize(name) + " should be valid integer.");	
					}
					break;			
			}	
		}
		if(errors.length > 0) 
			return errors.join(", ");
		return null;
	}catch(ex){
		console.log(ex);
		return null;
	}	
}
