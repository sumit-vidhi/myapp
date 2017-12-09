const mysql = require('mysql');
const Promise = require("bluebird");
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
const Db = require('../core').MySql;
const db = new Db();


module.export = {
	queryAll : function(table, options, cb){

	},

	queryOne : function(table, options, cb){

	},

	insert : function(table, data, cb){

	},

	upadate : function(table, data, condition, cb){

	},

	delete : function(table, data, condition, cb){

	},
	
	sql : function(sql, cb){

	} 

}

function formatSql(){
	
}