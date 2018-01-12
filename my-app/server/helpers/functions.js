const util = require('util');
const bcrypt = require('bcrypt');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const im = require('imagemagick');
const fs = require('fs');
const userconfig = require('../config').app.user;
const appPaths = require('../config').paths;
const saltRounds = 10;

module.exports = {
	isSet : function(obj){
		return obj && obj !== 'null' && obj !== 'undefined' && (! this.isEmptySring(obj)) && (! this.isEmptyObject(obj));	
	},

	isEmptySring : function(str){
		return typeof obj === 'string' && str.trim() == '';
	},

	isEmptyObject : function(obj){
		if(typeof obj === 'object'){
			for(let prop in obj)
	        	return false;
	        return true;
		}
		return false;
        	
	},

	isString : function(obj){
		return this.isSet(obj) && typeof obj === 'string';		
	},

	isArray : function(obj){
		return this.isSet(obj) && obj.constructor === Array;
	},

	isDate : function(obj){
		return this.isSet(obj) && obj.constructor === Date;
	},

	isObject : function(obj){
		return this.isSet(obj) && typeof obj === 'object';	
	},

	isNumber : function(obj){
		return this.isSet(obj) && typeof obj === 'number';	
	},
	
	toArray : function(obj){
		return this.isString(obj) ? obj.split(',') : [];	
	},
	toString : function(obj){
		return string(obj);
	},
	toCapitalize : function(str){
		if(this.isString(str)){
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
		return str;
	},
	toUpper : function(str){
		if(this.isString(str)){
			return str.toUpperCase();
		}
		return str;	
	},
	toLower : function(str){
		if(this.isString(str)){
			return str.toLowerCase();
		}
		return str;	
	},
	trim : function(str){
		if(this.isString(str)){
			return str.trim();
		}
		return str;		
	},
	escape : function(str){
		if(this.isString(str)){
			return str.replace(/\\/g, "\\\\").replace(/\$/g, "\\$").replace(/'/g, "\\'").replace(/"/g, "\\\"");
		}
		return str;		
	},
	getRandStr : function(length){
		let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
		if(! length){
			length = 32;
		}
		return this.generateString(length, chars);	
	},
	getRandNum : function(length){
		let chars = "0123456789";
		if(! length){
			length = 10;
		}
		return this.generateString(length, chars);
	},
	
	time : function(){
		let d = new Date();
		return Math.round(d.getTime() / 1000);
	},

	now : function(format){
		if(! format) format = 'yyyy-MM-dd hh:mm:ss'; 
		return this.formatDate(new Date(), format);
	},

	toDateTime : function(date){ 
		if(this.isDate(date) && this.isString(date)){
			date = new Date(date);
		}
		return this.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
	},

	formatDate : function(x, y) {
	    var z = {
	        M: x.getMonth() + 1,
	        d: x.getDate(),
	        h: x.getHours(),
	        m: x.getMinutes(),
	        s: x.getSeconds()
	    };
	    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
	        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
	    });

	    return y.replace(/(y+)/g, function(v) {
	        return x.getFullYear().toString().slice(-v.length)
	    });
	},

	generateString : function(length, chars) {
		var result = '';
		for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return result;
	},
	getHash : function(text){
		bcrypt.hash(text, saltRounds, function(err, hash) {
		  return hash;
		});	
	},
	validateHash : function(text, hash){
		console.log(text, hash)
		bcrypt.compare(text, hash, function(err, res) {
	    	return res;
		});
	},
	getHashSync : function(text){
		return bcrypt.hashSync(text, saltRounds);
	},

	validateHashSync : function(text, hash){
		return bcrypt.compareSync(text, hash);
	},

	getToken : function(code, expiresIn){
		if(! expiresIn) expiresIn = '1h';;
		return jwt.sign({ code : code }, userconfig.tokenSecret, { expiresIn: expiresIn });
	},

	getTokenKey : function(token){
		try {
			let decoded = jwt.verify(token, userconfig.tokenSecret);
			return decoded.code
		} catch(err) {
  			console.log(err);
		}
	},

	verifyToken : function(code, token){
		try {
			let decoded = jwt.verify(token, userconfig.tokenSecret);
			return decoded.code == code;
		} catch(err) {
  			console.log(err);
		}	
	},

	getSessionHash : function(code){
		return cryptoJS.HmacMD5( code, userconfig.sessionSecret).toString();
	},

	varifySessionHash : function(code, hash){
		return cryptoJS.HmacMD5( code, userconfig.sessionSecret).toString() == hash;
	},

	uploadFile : function(dest){
		if(! dest) dest = appPaths.uploads;

		let upload = multer({ dest: dest});
		let  obj = {
			getFileByName : function(fileName){
				return upload.single(fileName); 
			},
			getFilesByName : function(fileName){
				return upload.array(fileName); 
			}
		};
		return obj;
	},

	getImage : function(file){
		return {
			file : file,

			ext : function(){
				return this.file.originalname.split('.').pop();
			},

			crop : function(dest, data, cb){
				let args = data.w + 'x' + data.h +'+' + data.x + '+' + data.y;
				im.convert([ this.file.path, '-crop', args, dest], cb);
			},
			
			save : function(dest, data, cb){
				let self = this;
				let args = data.nw + 'x' + data.nh;
				this.crop(dest, data, function(err, stdOut){
					if(err) return cb(err);
					fs.unlinkSync(self.file.path);
					im.convert([dest, '-resize', args, dest ], cb);
				})
				
			}
		};
	},

	substr : function(str, start, length){
		str += '';
		return str.substr(start, length);
	},

	unlinkSync : function(filePath){
		return fs.unlinkSync(filePath);
	}

}