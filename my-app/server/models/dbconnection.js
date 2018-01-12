const config = require("../config");
//var _ = require('../node_modules/underscore')._;
var Backbone = require('../../node_modules/backbone');
var mssql = require('../../node_modules/mssql');


var createConnection  = function () {
	
	// Uses node-mssql to establish connection with database
	mssql.connect(config.db,function(){
		console.log("connected");
	});
	
	
	// Main model
	var SQLModel = Backbone.Model.extend({
		
		// Function instead of set, removes functions passed back in results by node-mysql
		setSQL: function(sql) {
			for (var key in sql) {
				if (typeof(sql[key]) != "function") {
					this.set(key, sql[key]);
				}
			};
		},
		
		// Function for disconnect MySQL connection
		disconnect: function(){
			mssql.close();
		},
		
		// Function for creating custom queries
		query: function(query, callback) {
			console.log(query);
			// mssql request for query
			var request = new mssql.Request(); 
			request.query(query, function(err2, recordset) {
				console.log(recordset);
			   if(callback){
					callback(err2, recordset);
				}
			});
		},
		
	});
	return SQLModel;
}

var MyAppModel = createConnection();

module.exports = MyAppModel;