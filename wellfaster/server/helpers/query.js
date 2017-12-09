const mysql = require('mysql');
const Promise = require("bluebird");
const fn = require('../helpers/functions');
const core = require('../core');

const using = Promise.using;

module.exports = {
	insert : function(table, data, cb){
		let query = "INSERT INTO ?? SET ?";
		let params = [table, data]; 
		let sql = this.format(query, params);

		this.execute(sql, cb);
	},

	update : function(table, data, where, cb){
		let query = "UPDATE ?? SET ? WHERE ?";
		let params = [table, data, where]; 
		let sql = this.format(query, params);

		this.execute(sql, cb);
	},

	updateAll : function(options, cb){
		let sql = this.getQuery("UPDATE", options);
		return this.execute(sql, cb);
	},

	deleteAll : function(options, cb){
		let sql = this.getQuery("DELETE", options);
		return this.execute(sql, cb);	
	},

	queryAll : function(options, cb){
		let sql = this.getQuery("SELECT", options);
		return this.execute(sql, cb);	
	},
	queryOne : function(options, cb){
		let sql = this.getQuery("SELECT", options);
			sql += " LIMIT 1";
		return this.execute(sql, cb);	
	},
	count : function(options, cb){
		let sql = this.select(options);
			sql += " LIMIT 1";
		return this.execute(sql, cb);	
	},

	format : function(sql, params){
		return fn.trim(mysql.format(sql, params));
	},

	execute : function(sql, cb){
		return runQuery(sql, cb);
	},

	getQuery : function(type, options){
		try{
			let query 	= "", 
				select 	= "*", 
				from 	= "" , 
				where 	= "1", 
				data 	= [];

			switch(type){
				case "SELECT" : 
					if(options.fields){
						if(fn.isString(fields)){
							fields = fn.toArray(fields);
						}
						select 	= "??"; 
						data.push(fields);
					} 	
					query += "SELECT " + select + " ";

					if(options.table){
						data.push(options.table);
					}

					query += "FROM ?? ";
					
					break;

				case "DELETE" : 
					query += "DELETE ";

					if(options.table){
						data.push(options.table);
					}

					query += "FROM ?? ";

					break;

				case "UPDATE" : 
					query += "UPDATE ";

					if(options.table){
						data.push(options.table);
					}

					query += " ?? ";	

			}


			if(options.params){
				let obj = addWhere(options.params);
				if(obj){
					where = (obj.str) ? obj.str : '1';
					if(obj.arr)
						while(obj.arr.length > 0)
							data.push(obj.arr.shift());
				}
				
			}
			
			query += "WHERE " + where;

			return this.format( query, data );

		}catch(ex){
			console.log(ex);
			return false;
		}	
	}

}

function runQuery(query, cb){
	console.log(query);
	using(core.getSqlConnection(), function(conn) {
		return conn.query(query, cb);
	}).then(function(result) {
	    // connection already disposed here
	});
};

function addWhere(params){
	let data = [];
	if(params){
		where = "";
		let i =0;
		for(k in params){
			if(i > 0) where +=  " AND ";
			
			where +=  "?? = ?";
			data.push(k);
			data.push(params[k]);
			i++;
		}
	}
	return { str : where, arr : data };
}


